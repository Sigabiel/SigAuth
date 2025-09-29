import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Module handling authentication and authorization.
 */
@Module({
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
