import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  // Admin - Get all sessions
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllSessions() {
    return this.sessionService.getAll();
  }

  // Admin - Create new session
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createSession(
    @Body('date') date: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
  ) {
    return this.sessionService.create({ date: new Date(date), startTime, endTime });
  }

  // Admin - Update session
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('date') date: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Body('capacity') capacity: number
  ) {
    return this.sessionService.update(id, { date: new Date(date), startTime, endTime, capacity });
  }

  // Admin - Delete session
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteSession(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.delete(id);
  }
}
