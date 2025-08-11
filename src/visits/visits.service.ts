import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, VisitStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail.service';
import { NotificationGateway } from 'src/NotificationGateway';

@Injectable()
export class VisitsService {
    constructor(private prisma: PrismaService,
        private mailService: MailService,
        private notificationGateway: NotificationGateway, // Assuming you have a NotificationGateway for WebSocket notifications
    ) {}
// Booking kunjungan (Visitor)
  async bookVisit(
  firstName: string,
  lastName: string,
  email: string,
  tujuanId: string,
  phoneNumber: string,
  visitDate: Date, // Tanggal kunjungan
  visitors: string, // e.g. "John Doe, Jane Doe"
  sessionId: string,
  startTime: string | null, // e.g. "10:00"
  endTime: string | null, // e.g. "11:00"
  institutionId: string,
  status: VisitStatus | null,
  packageOption: string | null,
  specialRequest?: string
) {
  // Cari user by email
  let user = await this.prisma.user.findUnique({ where: { email } });

  // Jika tidak ada → create user baru
  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        role: 'VISITOR', // Default role
        password: '', // Kosongkan / atau set random hash
      },
    });
  }


  const visitSettings = await this.prisma.visitSetting.findMany();
  const allowedDays = visitSettings.map((s) => s.allowedWeekday);


  // Create Visit Booking
  const visit = await this.prisma.visit.create({
    data: {
      userId: user.id,
      sessionId: sessionId,
      visitDate: new Date(visitDate).toISOString(), // Convert to ISO string
      visitors,
      tujuanId: tujuanId, // Assuming tujuanId is a string
      status: status ? status : 'PENDING', // Default status
      institutionId,
      startTime: startTime ? startTime : "null", // Set default date
      endTime: endTime ? endTime : "null", // Set default date
      packageOption,
      specialRequest,
    },
      include: { user: true, session: true, institution: true, tujuan: true },
    });

    // 5. (Optional) Emit Notification ke Admin via WebSocket
    // Realtime Notify Admin
    this.notificationGateway.notifyNewBooking({
      id: visit.id,
      user: visit.user.firstName + ' ' + visit.user.lastName,
      institution: visit.institution.name,
      date: visit.visitDate,
      status: visit.status,
    });

    return { message: 'Booking created, waiting approval' };
  }
  

  // Admin - Approve Booking
  async approveVisit(id: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: { user: true, session: true, institution: true },
    });
    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.status === 'APPROVED') {
      throw new BadRequestException('Visit already approved');
    }

    await this.prisma.visit.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Send Email Notification
    const emailBody = `
      <h1>Booking Approved!</h1>
      <p>Dear ${visit.user.firstName + ' ' + visit.user.lastName},</p>
      <p>Your visit booking on <b>${visit.visitDate.toDateString()}</b> from ${visit.session.startTime} to ${visit.session.endTime} has been approved.</p>
      ${visit.institution.isPaid ? `<p>Please proceed to payment: Rp ${visit.institution.price}</p>` : '<p>This visit is free of charge.</p>'}
    `;
    await this.mailService.sendMail(visit.user.email, 'Your Visit Booking Approved', emailBody);

    return { message: 'Visit approved & email sent' };
  }

  // Admin - Reject Booking
  async rejectVisit(visitId: string) {
    const visit = await this.prisma.visit.update({
      where: { id: visitId },
      data: { status: 'REJECTED' }
    });

    // (Optional) Kirim Email Notifikasi Penolakan

    return visit;
  }
  async getSessionAvailabilityByMonth(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all visits within this month
    const visits = await this.prisma.visit.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        visitDate: true,
        sessionId: true,
      },
    });

    // Get all session templates (slot waktu)
    const sessions = await this.prisma.session.findMany();

    // Prepare a map of date -> available sessions
    const availabilityMap: Record<string, { date: string; status: 'available' | 'full' | 'blocked' }> = {};

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split('T')[0];

      const bookedSessionIds = visits
        .filter((v) => v.visitDate.toISOString().split('T')[0] === dateStr)
        .map((v) => v.sessionId);

      const hasAvailableSession = sessions.some((s) => !bookedSessionIds.includes(s.id));

      availabilityMap[dateStr] = {
        date: dateStr,
        status: hasAvailableSession ? 'available' : 'full',
      };
    }

    // Get allowed days and events
    const visitSetting = await this.prisma.visitSetting.findFirst();

    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        isBookingClosed: true,
      },
    });

    // Fetch allowed weekdays from visit settings table
    const visitSettings = await this.prisma.visitSetting.findFirst();
    const allowedDays = visitSettings?.allowedWeekday ?? [];

    for (const dateStr in availabilityMap) {
      const dateObj = new Date(dateStr);
      const dayOfWeek = dateObj.getDay();

      // Check if there's an event on this date that has booking closed
      const isEventBlocked = events.some(
        e => e.date.toISOString().split('T')[0] === dateStr && e.isBookingClosed
      );

      // Only days NOT in allowedDays are available; so block if it’s an allowed weekday or a closed event
      if (allowedDays !== dayOfWeek || isEventBlocked) {
        availabilityMap[dateStr].status = 'blocked';
      }
    }

    return Object.values(availabilityMap);
  }
  async getSessionsByDate(date: string) {
    const sessions = await this.prisma.session.findMany();

    const visits = await this.prisma.visit.findMany({
      where: {
        visitDate: new Date(date),
      },
      select: {
        sessionId: true,
      },
    });

    const bookedSessionIds = visits.map((v) => v.sessionId);

    return sessions.map((s) => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: bookedSessionIds.includes(s.id),
    }));
  }


  // Admin - Get All Visits (with filter by status)
  async getAllVisits(status?: string) {
    const where: Prisma.VisitWhereInput = status
  ? { status: status as VisitStatus }
  : {};
    return this.prisma.visit.findMany({
        where,
        include: { user: true, session: true, institution: true },
    });
    }
}
