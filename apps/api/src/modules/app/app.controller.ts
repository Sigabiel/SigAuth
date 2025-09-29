import { AppsService } from '@/modules/app/app.service';
import { CreateAppDto } from '@/modules/app/dto/create-app.dto';
import { DeleteAppDto } from '@/modules/app/dto/delete-app.dto';
import { EditAppDto } from '@/modules/app/dto/edit-app.dto';
import { AuthGuard } from '@/modules/auth/guards/authentication.guard';
import { IsRoot } from '@/modules/auth/guards/authentication.is-root.guard';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiRequestTimeoutResponse,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { App } from '@sigauth/prisma-wrapper/prisma-client';

@Controller('app')
@UseGuards(AuthGuard)
export class AppsController {
    constructor(private readonly appsService: AppsService) {}

    @Post('create')
    @UseGuards(IsRoot)
    @ApiCreatedResponse({
        description: 'App created successfully',
        example: {
            app: {
                id: 25,
                name: 'test',
                url: 'https://sigauth.com',
                permissions: {
                    asset: ['chart-insights', 'reports', 'maintainer'],
                    container: ['brand-manager', 'editor', 'viewer'],
                    root: ['app1-administrator', 'app1-developer'],
                },
                webFetch: {
                    enabled: true,
                    lastFetch: 0,
                    success: false,
                },
            },
        },
    })
    @ApiRequestTimeoutResponse({ description: 'Request to fetch apps permissions timed out' })
    @ApiUnprocessableEntityResponse({
        description: 'Fetched permissions have invalid format (e.g. root is not an array of strings, etc.',
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiUnprocessableEntityResponse({ description: 'Duplicate permissions in different categories' })
    async createApp(@Body() createAppDto: CreateAppDto): Promise<App> {
        return await this.appsService.createApp(createAppDto);
    }

    @Post('edit')
    @UseGuards(IsRoot)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'App updated successfully',
        example: {
            app: {
                id: 25,
                name: 'test',
                url: 'https://sigauth.com',
                permissions: {
                    asset: ['chart-insights', 'reports', 'maintainer'],
                    container: ['brand-manager', 'editor', 'viewer'],
                    root: ['app1-administrator', 'app1-developer'],
                },
                webFetch: {
                    enabled: true,
                    lastFetch: 0,
                    success: false,
                },
            },
        },
    })
    @ApiRequestTimeoutResponse({ description: 'Request to fetch apps permissions timed out' })
    @ApiUnprocessableEntityResponse({
        description:
            'Fetched permissions have invalid format (e.g. root is not an array of strings, etc. or duplicate permissions in different categories',
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'App not found' })
    async editApp(@Body() editAppDto: EditAppDto): Promise<App> {
        return await this.appsService.editApp(editAppDto);
    }

    @Post('delete')
    @UseGuards(IsRoot)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: 'Apps deleted successfully' })
    @ApiNotFoundResponse({ description: 'Not all apps found or invalid ids provided' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async deleteApps(@Body() deleteAppsDto: DeleteAppDto) {
        await this.appsService.deleteApps(deleteAppsDto.appIds);
    }
}
