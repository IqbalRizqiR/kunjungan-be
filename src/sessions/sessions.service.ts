import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.session.findMany({
      
    });
  }

  async create(data: { date: Date; startTime: string; endTime: string; }) {
    return this.prisma.session.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }

  async update(id: string, data: { date: Date; startTime: string; endTime: string; capacity: number }) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.session.update({
      where: { id },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }

  async delete(id: string) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.session.delete({ where: { id } });
  }
}
