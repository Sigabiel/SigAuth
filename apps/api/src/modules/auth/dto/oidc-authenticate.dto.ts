import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class OIDCAuthenticateDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({ description: 'The ID of the OIDC app to authenticate with', example: 69 })
    appId: number;
    // TODO challenge: string;
}
