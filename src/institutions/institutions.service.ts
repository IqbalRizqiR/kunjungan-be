import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.institution.findMany(
        {
            include: {
                packages: true,
            },
        }
    );
  }

  async getAllPackage() {
    return this.prisma.package.findMany({
      orderBy: { name: 'asc' },
      include: { institution: true },
    });
  }

  async create(data: { name: string; isPaid: boolean; price?: number }) {
    return this.prisma.institution.create({
      data: {
        name: data.name,
        isPaid: data.isPaid,
        price: data.isPaid ? data.price : null,
      },
    });
  }

  async update(id: string, data: { name: string; isPaid: boolean; price?: number }) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return this.prisma.institution.update({
      where: { id },
      data: {
        name: data.name,
        isPaid: data.isPaid,
        price: data.isPaid ? data.price : null,
      },
    });
  }

  async delete(id: string) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return this.prisma.institution.delete({ where: { id } });
  }
  async addPackage(institutionId: string, data: { name: string; value: string; price: number }) {
    const institution = await this.prisma.institution.findUnique({ where: { id: institutionId } });
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return this.prisma.package.create({
      data: {
        name: data.name,
        value: data.value,
        price: data.price,
        institutionId: institutionId,
      },
    });
  }
}
