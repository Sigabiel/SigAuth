import { AccountService } from '@/modules/account/account.service';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { DeleteAccountDto } from '@/modules/account/dto/delete-account.dto';
import { EditAccountDto } from '@/modules/account/dto/edit-account.dto';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Account } from '@sigauth/prisma-wrapper/prisma-client';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('create')
    @UseGuards(IsRoot) // TODO Change to proper permission
    @HttpCode(HttpStatus.CREATED)
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

    @Post('edit')
    @UseGuards(IsRoot) // TODO Change to proper permission
    @ApiOkResponse({
        description: 'Edited account successfully!',
        example: { account: { id: 1, name: 'admin', email: 'test@example.com', api: '<API_TOKEN>' } },
    })
    @ApiBadRequestResponse({ description: 'Name or Email already exists' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async editAccount(@Body() editAccountDto: EditAccountDto): Promise<{ account: Account }> {
        const account = await this.accountService.editAccount(editAccountDto);
        return { account };
    }

    @Post('delete')
    @UseGuards(IsRoot) // TODO Change to proper permission
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNotFoundResponse({ description: 'Not all accounts found or invalid ids provided' })
    async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto): Promise<void> {
        await this.accountService.deleteAccount(deleteAccountDto);
    }
}
