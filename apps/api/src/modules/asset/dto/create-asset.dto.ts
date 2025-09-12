import { IsNumber, IsObject, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 1, type: 'number' })
    assetTypeId: number;

    @IsString()
    @MinLength(4)
    @ApiProperty({ example: 'Blog Post', type: 'string', minimum: 4 })
    name: string;

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => Object)
    @ApiProperty({ type: Object, example: { '1': 'value', '2': 5 } })
    fields: Record<string, string | number>; // fieldId and value
}
