import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionsService) {}

  // Admin - Get all institutions
  @Get()
  async getAllInstitutions() {
    return this.institutionService.getAll();
  }

  // Admin - Create new institution
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createInstitution(
    @Body('name') name: string,
    @Body('isPaid') isPaid: boolean,
    @Body('price') price?: number
  ) {
    return this.institutionService.create({ name, isPaid, price });
  }

  // Admin - Update institution
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateInstitution(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('name') name: string,
    @Body('isPaid') isPaid: boolean,
    @Body('price') price?: number
  ) {
    return this.institutionService.update(id, { name, isPaid, price });
  }

  // Admin - Delete institution
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteInstitution(@Param('id', ParseUUIDPipe) id: string) {
    return this.institutionService.delete(id);
  }
  // Admin - Add package to institution
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/packages')
  async getPackagesByInstitution() {
    const institution = await this.institutionService.getAllPackage();
    return institution;

  }
  // Admin - Add package to institution
  @Get(':id/packages')
  async getPackagesByInstitutionId(@Param('id', ParseUUIDPipe) id: string) {
    const institution = await this.institutionService.getAll();
    return institution.find((inst) => inst.id === id)?.packages || [];
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post(':id/packages')
    async addPackage(
        @Param('id') institutionId: string,
        @Body() data: { name: string; value: string; price: number }
    ) 
    {
        return this.institutionService.addPackage(institutionId, data);
    }
}
