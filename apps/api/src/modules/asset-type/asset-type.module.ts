import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { AssetTypesService } from '@/modules/asset-type/asset-type.service';
import { AssetTypesController } from '@/modules/asset-type/asset-type.controller';

@Module({
    controllers: [AssetTypesController],
    providers: [AssetTypesService, PrismaService, AuthGuard, IsRoot],
})
export class AssetTypesModule {}
