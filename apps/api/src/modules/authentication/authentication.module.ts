import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthenticationController } from '@/modules/authentication/authentication.controller';
import { AuthenticationService } from '@/modules/authentication/authentication.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [AuthenticationController],
    providers: [AuthenticationService, PrismaService],
})
export class AuthenticationModule {}
