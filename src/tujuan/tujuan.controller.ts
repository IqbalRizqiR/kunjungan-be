import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TujuanService } from './tujuan.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';

@Controller('tujuan')
export class TujuanController {
    constructor(private readonly tujuanService: TujuanService) {}

    @Get()
    async getAll() {
        return this.tujuanService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post()
    async create(@Body() data: { name: string }) {
        return this.tujuanService.create(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: { name: string }) {
        return this.tujuanService.update(id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.tujuanService.delete(id);
    }
}
