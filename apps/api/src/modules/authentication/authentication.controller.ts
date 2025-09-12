import { AuthenticationService } from '@/modules/authentication/authentication.service';
import { LoginRequestDto } from '@/modules/authentication/dto/login-request.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiAcceptedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import * as process from 'node:process';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    /**
     * this route should only be called from the SigAuth frontend.
     *
     * how can we verify this:
     * - we could use cloudflare turnstile or something similar
     */
    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'Session created and cookie set. No content.' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() loginRequestDto: LoginRequestDto, @Res() res: Response) {
        const sessionId = await this.authenticationService.authenticate(loginRequestDto);
        res.cookie('sid', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * +(process.env.SESSION_EXPIRATION_OFFSET ?? 5), // needs to be in millis
            path: '/',
        });

        res.sendStatus(202);
    }
}
