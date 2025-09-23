import { PrismaService } from '@/common/prisma/prisma.service';
import { Utils } from '@/common/utils';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { DeleteAccountDto } from '@/modules/account/dto/delete-account.dto';
import { EditAccountDto } from '@/modules/account/dto/edit-account.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountWithPermissions } from '@sigauth/prisma-wrapper/prisma';
import { Account, Prisma } from '@sigauth/prisma-wrapper/prisma-client';
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

    async editAccount(editAccountDto: EditAccountDto): Promise<AccountWithPermissions> {
        // Check for unique values (Name/Email)
        if (editAccountDto.name || editAccountDto.email) {
            const orConditions: Prisma.AccountWhereInput[] = [];
            if (editAccountDto.name) orConditions.push({ name: editAccountDto.name });
            if (editAccountDto.email) orConditions.push({ email: editAccountDto.email });

            const existing = await this.prisma.account.findFirst({
                where: {
                    OR: orConditions,
                },
            });

            if (existing && existing.id !== editAccountDto.id) {
                throw new BadRequestException('Name or Email already exists');
            }
        }

        // Dynamisch Update-Objekt bauen
        const data: { name?: string; email?: string; password?: string; api?: string | null } = {};
        if (editAccountDto.name) data.name = editAccountDto.name;
        if (editAccountDto.email) data.email = editAccountDto.email;
        if (editAccountDto.password) data.password = bcrypt.hashSync(editAccountDto.password, 10);
        if (editAccountDto.apiAccess !== undefined) {
            data.api = editAccountDto.apiAccess ? Utils.generateToken(32) : null;
        }

        const account = await this.prisma.account.update({
            where: { id: editAccountDto.id },
            data,
        });

        return { ...account, permissions: [] };
    }

    async deleteAccount(deleteAccountDto: DeleteAccountDto) {
        await this.prisma.permissionInstance.deleteMany({
            where: { accountId: { in: deleteAccountDto.accountIds } },
        });

        await this.prisma.account.deleteMany({
            where: { id: { in: deleteAccountDto.accountIds } },
        });
    }
}
