import { Module } from '@nestjs/common';
import { TujuanService } from './tujuan.service';
import { TujuanController } from './tujuan.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [TujuanService, PrismaService],
  controllers: [TujuanController],
})
export class TujuanModule {}
