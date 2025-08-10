import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VisitSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.visitSetting.findMany({
      orderBy: { allowedWeekday: 'asc' },
    });
  }

  async add(data: { allowedWeekday: number }) {
    const firstSetting = await this.prisma.visitSetting.findFirst({
      orderBy: { allowedWeekday: 'asc' },
    });
    if (!firstSetting) {
      throw new NotFoundException('No visit settings available to update');
    }
    return this.prisma.visitSetting.update({
      where: { id: firstSetting.id },
      data: { allowedWeekday: data.allowedWeekday },
    });
  }

  async delete(id: string) {
    const setting = await this.prisma.visitSetting.findUnique({ where: { id } });
    if (!setting) {
      throw new NotFoundException('Visit setting not found');
    }

    return this.prisma.visitSetting.delete({ where: { id } });
  }

  // Validate if given date is allowed for booking
  async isDateAllowed(date: Date): Promise<boolean> {
    const weekday = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const allowed = await this.prisma.visitSetting.findMany({ where: { allowedWeekday: weekday } });
    return allowed.length > 0;
  }
}
