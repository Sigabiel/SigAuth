import { PrismaService } from '@/common/prisma/prisma.service';
import { AccountModule } from '@/modules/account/account.module';
import { AppsModule } from '@/modules/app/app.module';
import { AssetTypesModule } from '@/modules/asset-type/asset-type.module';
import { AssetModule } from '@/modules/asset/asset.module';
import { ContainerModule } from '@/modules/container/container.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'webapp', 'dist'),
        }),
        AccountModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000,
                limit: 50,
            },
        ]),
        AssetTypesModule,
        AssetModule,
        AppsModule,
        ContainerModule,
        AuthModule,
    ],
    providers: [PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
