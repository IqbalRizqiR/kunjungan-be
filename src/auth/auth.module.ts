import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, PrismaService],
  exports: [JwtModule],
})
export class AuthModule {}
