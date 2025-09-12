import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) {}

    async createAccount(createAccountDto: CreateAccountDto) {
        // TODO Hash password

        const account: Account = await this.prisma.account.create({ data: createAccountDto });
        return account;
    }
}
