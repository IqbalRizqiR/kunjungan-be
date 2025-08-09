import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { EventsService } from './events.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  // Admin - Get all events
  @Get()
  async getAllEvents() {
    return this.eventService.getAll();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('active')
  async getActiveEvents() {
    return this.eventService.getActiveEvents();
  }

  // Admin - Create new event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createEvent(
    @Body('title') title: string,
    @Body('date') date: string,
    @Body('isBookingClosed') isBookingClosed: boolean
  ) {
    return this.eventService.create({ title, date: new Date(date), isBookingClosed });
  }

  // Admin - Update event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('title') title: string,
    @Body('date') date: string,
    @Body('isBookingClosed') isBookingClosed: boolean
  ) {
    return this.eventService.update(id, { title, date: new Date(date), isBookingClosed });
  }

  // Admin - Delete event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.delete(id);
  }
}
