import { PrismaService } from '@/common/prisma/prisma.service';
import { AssetService } from '@/modules/asset/asset.service';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { ContainerController } from '@/modules/container/container.controller';
import { ContainerService } from '@/modules/container/container.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [ContainerController],
    providers: [ContainerService, AssetService, PrismaService, AuthGuard, IsRoot],
})
export class ContainerModule {}
