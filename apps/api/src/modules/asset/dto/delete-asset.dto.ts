import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAssetDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    @ApiProperty({ example: [1, 2, 3], type: [Number], minItems: 1 })
    assetIds: number[];
}
