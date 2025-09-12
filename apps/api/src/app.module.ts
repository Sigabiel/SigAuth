import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AccountModule } from '@/modules/account/account.module';
import { AppsModule } from '@/modules/app/app.module';
import { AssetTypesModule } from '@/modules/asset-type/asset-type.module';
import { AssetModule } from '@/modules/asset/asset.module';
import { AuthenticationModule } from '@/modules/authentication/authentication.module';
import { ContainerModule } from '@/modules/container/container.module';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'webapp', 'dist'),
        }),
        AuthenticationModule,
        AccountModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000,
                limit: 10,
            },
        ]),
        AssetTypesModule,
        AssetModule,
        AppsModule,
        ContainerModule,
    ],
    providers: [PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
