import { PrismaService } from '@/common/prisma/prisma.service';
import { Utils } from '@/common/utils';
import { LoginRequestDto } from '@/modules/auth/dto/login-request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountWithPermissions } from '@sigauth/prisma-wrapper/prisma';
import { Account, App, Asset, AssetType, Container, Session } from '@sigauth/prisma-wrapper/prisma-client';
import { SigAuthRootPermissions } from '@sigauth/prisma-wrapper/protected';
import * as bycrypt from 'bcryptjs';
import dayjs from 'dayjs';
import * as process from 'node:process';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async login(loginRequestDto: LoginRequestDto) {
        const account = await this.prisma.account.findUnique({ where: { name: loginRequestDto.username } });
        if (!account || !bycrypt.compareSync(loginRequestDto.password, account.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // validate 2fa
        if (account.secondFactor && typeof loginRequestDto.secondFactor !== 'string') {
            throw new UnauthorizedException('2FA required');
        } else if (account.secondFactor) {
            const verified = speakeasy.totp.verify({
                secret: account.secondFactor,
                encoding: 'ascii',
                token: loginRequestDto.secondFactor!,
            });

            if (!verified) {
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        // create session and return token
        const refreshToken = Utils.generateToken(64);
        const sessionId = Utils.generateToken(64);

        const created = dayjs().unix();
        const expire = created + (60 * 60 * 24 + +(process.env.SESSION_EXPIRATION_OFFSET ?? 5));
        await this.prisma.session.create({
            data: {
                sessionId,
                refreshToken,

                created,
                expire,
                subject: account.id,
            },
        });
        return sessionId;
    }

    async logout(account: AccountWithPermissions, sessionId: string) {
        const session = await this.prisma.session.delete({ where: { sessionId } });
        if (!session) throw new UnauthorizedException('Invalid session');
        // TODO handle automatically remove expired session from db after a certain time
    }

    async getInitData(
        sessionId: string,
        account?: AccountWithPermissions,
    ): Promise<{
        account: Account;
        session: Session;
        accounts: Account[];
        assets: Asset[];
        assetTypes: AssetType[];
        apps: App[];
        containers: Container[];
    }> {
        const session = await this.prisma.session.findUnique({ where: { sessionId } });
        if (!account || !session) throw new UnauthorizedException('Not authenticated');

        if (account.permissions.some(p => p.identifier == Utils.convertPermissionNameToIdent(SigAuthRootPermissions.ROOT))) {
            const [accounts, assets, assetTypes, apps, containers] = await Promise.all([
                this.prisma.account.findMany({ include: { permissions: true } }),
                this.prisma.asset.findMany(),
                this.prisma.assetType.findMany(),
                this.prisma.app.findMany(),
                this.prisma.container.findMany(),
            ]);

            return { account, session, accounts, assets, assetTypes, apps, containers };
        } else {
            const accounts = await this.prisma.account.findMany({
                where: { id: { in: account.accounts as number[] } },
                include: { permissions: true },
            });

            const apps = await this.prisma.app.findMany({
                where: { id: { in: account.permissions.map(p => p.appId) } },
            });

            const containers = await this.prisma.container.findMany({
                where: { id: { in: account.permissions.map(p => p.containerId).filter(id => id !== null) } },
            });

            const assetIds = containers.map(c => c.assets).flat();
            const assets = await this.prisma.asset.findMany({
                where: { id: { in: assetIds } },
            });

            const assetTypeIds = assets.map(a => a.typeId);
            const assetTypes = await this.prisma.assetType.findMany({
                where: { id: { in: assetTypeIds } },
            });

            console.log(apps, accounts, containers, assets, assetTypes);
            return { account, session, accounts: [], assets: [], assetTypes: [], apps: [], containers: [] }; // TODO test if this works
        }
    }
}
