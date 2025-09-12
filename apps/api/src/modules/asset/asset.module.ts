import { Module } from '@nestjs/common';
import { AssetController } from '@/modules/asset/asset.controller';
import { AssetService } from '@/modules/asset/asset.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';

@Module({
    controllers: [AssetController],
    providers: [AssetService, PrismaService, AuthGuard, IsRoot],
})
export class AssetModule {}
