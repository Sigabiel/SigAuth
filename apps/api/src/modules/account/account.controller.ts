import { AccountService } from '@/modules/account/account.service';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Account } from '@sigauth/prisma-wrapper/prisma-client';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('create')
    @UseGuards(IsRoot)
    @ApiCreatedResponse({
        description: 'Created account successfully!',
        example: { account: { id: 1, name: 'admin', email: 'test@example.com', api: '<API_TOKEN>' } },
    })
    @ApiBadRequestResponse({ description: 'Name or Email already exists' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<{ account: Account }> {
        const account = await this.accountService.createAccount(createAccountDto);
        return { account };
    }
}
