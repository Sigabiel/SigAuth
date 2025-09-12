import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { CreateAccountDto } from '@/modules/account/dto/create-account.dto';
import { AuthGuard } from '@/modules/authentication/guards/authentication.guard';
import { IsRoot } from '@/modules/authentication/guards/authentication.is-root.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('create')
    @UseGuards(IsRoot)
    @ApiCreatedResponse({ description: 'No implementation yet' })
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        console.log(createAccountDto);
        // TODO this is not fully implemented
        await this.accountService.createAccount(createAccountDto);
    }
}
