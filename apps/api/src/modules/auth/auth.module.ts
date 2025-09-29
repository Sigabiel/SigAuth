import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/common/prisma/prisma.service';

/**
 * Module handling authentication and authorization.
 */
@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
})
export class AuthModule {}
