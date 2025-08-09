import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { VisitSettingsService } from './visit-settings.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('visit-settings')
export class VisitSettingsController {
  constructor(private readonly visitSettingService: VisitSettingsService) {}

  // Admin - Get allowed visit days
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllSettings() {
    return this.visitSettingService.getAll();
  }

  @Get('allowed-days')
  async getAllowedWeekdays() {
    const settings = await this.visitSettingService.getAll();
    return settings.map((s) => s.allowedWeekday);
  }

  // Admin - Add allowed visit day
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async addSetting(@Body('allowedWeekday') allowedWeekday: number) {
    return this.visitSettingService.add({ allowedWeekday });
  }

  // Admin - Remove allowed visit day
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteSetting(@Param('id', ParseUUIDPipe) id: string) {
    return this.visitSettingService.delete(id);
  }
}
