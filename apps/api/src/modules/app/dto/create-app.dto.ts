import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PermissionsDto {
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ type: [String], example: '["chart-insights", "reports", "maintainer"]' })
    asset: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ type: [String], example: '["brand-manager", "editor", "viewer"]' })
    container: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ type: [String], example: '["app1-administrator", "app1-developer"]' })
    root: string[];
}

export class CreateAppDto {
    @IsString()
    @ApiProperty({ example: 'Starlink Monitoring', description: 'Name of the app', type: 'string' })
    name: string;

    @IsString()
    @ApiProperty({ example: 'https://starlink.com', description: 'URL of the app', type: 'string' })
    url: string;

    @ValidateNested()
    @Type(() => PermissionsDto)
    @ApiProperty({
        type: PermissionsDto,
        example: {
            asset: ['chart-insights', 'reports', 'maintainer'],
            container: ['brand-manager', 'editor', 'viewer'],
            root: ['app1-administrator', 'app1-developer'],
        },
    })
    permissions: PermissionsDto;

    @IsBoolean()
    @ApiProperty({
        example: true,
        type: 'boolean',
        description: 'Enable web fetch (periodically fetch permissions from the app)',
    })
    webFetchEnabled: boolean;
}
