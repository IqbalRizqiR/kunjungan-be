import { Controller, Post, Patch, Get, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { VisitStatus } from '@prisma/client';


@Controller('visits')
export class VisitsController {
  constructor(private readonly visitService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('book')
  async bookVisit(
    @Body('sessionId') sessionId: string,
    @Body('institutionId') institutionId: string,
    @Body('specialRequest') specialRequest: string,
    @Body('firstName') firstName: string,
    @Body('visitDate') visitDate: Date,
    @Body('startTime') startTime: string, // e.g. "10:00"
    @Body('endTime') endTime: string, // e.g. "11:00",
    @Body('packageOption') packageOption: string | null,
    @Body('status') status: VisitStatus | null,
    @Body('tujuanId') tujuan: string, // Assuming tujuanId is a string
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('visitors') visitors: VisitStatus, // e.g. "John Doe,
  ) {
    return this.visitService.bookVisit(
      firstName, 
      lastName, 
      email, 
      tujuan,
      phoneNumber, 
      visitDate, 
      visitors, 
      sessionId, 
      startTime ? startTime : "null", 
      endTime ? endTime : "null", 
      institutionId, 
      status, 
      packageOption, 
      specialRequest
    );
  }



  // Admin - Approve Booking
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approve')
  async approveVisit(@Param('id') id: string) {
    return this.visitService.approveVisit(id);
  }

  @Get('availability')
  async getAvailability(@Query('month') month: string, @Query('year') year: string) {
    return this.visitService.getSessionAvailabilityByMonth(parseInt(month), parseInt(year));
  }
  @Get('sessions')
  async getSessionsByDate(@Query('date') date: string) {
    return this.visitService.getSessionsByDate(date);
  }

  // Admin - Reject Booking
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/reject')
  async rejectVisit(@Param('id') id: string) {
    return this.visitService.rejectVisit(id);
  }


  // Admin - Get All Visits (optional status filter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/list')
  async getAllVisits(@Query('status') status?: string) {
    return this.visitService.getAllVisits(status);
  }
}
