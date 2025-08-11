import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TujuanService {
    constructor(private readonly prisma: PrismaService) {}
    
      async getAll() {
        return this.prisma.tujuan.findMany({});
      }
    
      async create(data: { name: string }) {
        return this.prisma.tujuan.create({
          data: {
            name: data.name,
          },
        });
      }

      async update(id: string, data: { name: string }) {
        const tujuan = await this.prisma.tujuan.findUnique({ where: { id } });
        if (!tujuan) {
          throw new NotFoundException('Tujuan not found');
        }
    
        return this.prisma.tujuan.update({
          where: { id },
          data: {
            name: data.name,
          },
        });
      }
    
      async delete(id: string) {
        const tujuan = await this.prisma.tujuan.findUnique({ where: { id } });
        if (!tujuan) {
          throw new NotFoundException('Tujuan not found');
        }

        return this.prisma.tujuan.delete({ where: { id } });
    }
}
