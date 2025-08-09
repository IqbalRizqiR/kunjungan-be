import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}
  async getAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async create(data: { title: string; date: Date; isBookingClosed: boolean }) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        date: data.date,
        isBookingClosed: data.isBookingClosed,
      },
    });
  }

  async update(id: string, data: { title: string; date: Date; isBookingClosed: boolean }) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date,
        isBookingClosed: data.isBookingClosed,
      },
    });
  }

  async delete(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.delete({ where: { id } });
  }

  // Frontend Main Page - Get Active Events (isBookingClosed = false)
  async getActiveEvents() {
    return this.prisma.event.findMany({
      where: { isBookingClosed: false },
      orderBy: { date: 'asc' },
    });
  }
}
