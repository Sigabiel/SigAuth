import { PrismaService } from '@/common/prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const sid = (request.cookies as Record<string, string>)?.['sid'];

        if (!sid) {
            throw new UnauthorizedException('No session found');
        }

        const session = await this.prisma.session.findUnique({
            where: { sessionId: sid },
            include: {
                account: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!session) {
            throw new UnauthorizedException('Invalid session');
        }

        request.account = session.account;
        return true;
    }
}
