import { PrismaService } from '@/common/prisma/prisma.service';
import { Utils } from '@/common/utils';
import { LoginRequestDto } from '@/modules/authentication/dto/login-request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bycrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import * as process from 'node:process';
import * as speakeasy from 'speakeasy';

// TODO NÄCHSTER STEP UNIT tESTS

@Injectable()
export class AuthenticationService {
    constructor(private readonly prisma: PrismaService) {}

    async authenticate(loginRequestDto: LoginRequestDto) {
        const account = await this.prisma.account.findUnique({ where: { name: loginRequestDto.name } });
        if (!account || !bycrypt.compareSync(loginRequestDto.password, account.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // validate 2fa
        if (account.secondFactor && !loginRequestDto.secondFactor) {
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
}
