import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetTypeField } from '@/common/types/json-types';
import { ApiProperty } from '@nestjs/swagger';
import { AssetTypeFieldDto } from '@/modules/asset-type/dto/create-asset-type.dto';

export class EditAssetTypeDto {
    @IsNumber()
    @ApiProperty({ example: 1, type: 'number' })
    assetTypeId: number;

    @IsString()
    @ApiProperty({ example: 'Blog Post', type: 'string' })
    updatedName: string;

    // new fields should have no id
    // existing field should provide their id within the AssetTypeField object
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AssetTypeFieldDto)
    @ApiProperty({ type: [AssetTypeFieldDto] })
    updatedFields: AssetTypeField[];
}
