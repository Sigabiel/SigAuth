import { Module } from '@nestjs/common';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { PrismaService } from '@/common/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { AppsController } from '@/modules/app/app.controller';
import { AppsService } from '@/modules/app/app.service';

@Module({
    imports: [HttpModule],
    controllers: [AppsController],
    providers: [AppsService, AuthGuard, IsRoot, PrismaService],
})
export class AppsModule {}
