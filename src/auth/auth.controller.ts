import { Controller, Post, Get, Body, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
    @Post('register')
    async register(
      @Body('email') email: string,
      @Body('password') password: string,
      @Body('firstName') firstName: string,
      @Body('lastName') lastName: string,
      @Body('phoneNumber') phoneNumber: string
    ) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          role: 'VISITOR', // Default role
        },
      });

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { access_token: token };
    }
    @Get('/admin-access')
    async getAdminAccess(@Body('email') email: string) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user || user.role !== 'ADMIN') {
        throw new BadRequestException('Access denied');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { message: 'Admin access granted', access_token: token };
    }
}
