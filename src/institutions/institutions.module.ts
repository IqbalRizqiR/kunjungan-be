import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionController } from './institutions.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [InstitutionsService, PrismaService],
  controllers: [InstitutionController]
})
export class InstitutionsModule {}
