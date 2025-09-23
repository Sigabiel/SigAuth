import { PrismaService } from '@/common/prisma/prisma.service';
import { Utils } from '@/common/utils';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountWithPermissions } from '@sigauth/prisma-wrapper/prisma';
import { Account } from '@sigauth/prisma-wrapper/prisma-client';
import bcrypt from 'bcryptjs';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) {}

    async createAccount(createAccountDto: CreateAccountDto): Promise<AccountWithPermissions> {
        const existing = await this.prisma.account.findFirst({
            where: {
                OR: [{ name: createAccountDto.name }, { email: createAccountDto.email }],
            },
        });

        if (existing) {
            throw new BadRequestException('Name or Email already exists');
        }

        const account: Account = await this.prisma.account.create({
            data: {
                name: createAccountDto.name,
                email: createAccountDto.email,
                password: bcrypt.hashSync(createAccountDto.password, 10),
                api: createAccountDto.apiAccess ? Utils.generateToken(32) : null,
            },
        });

        return { ...account, permissions: [] };
    }
}
