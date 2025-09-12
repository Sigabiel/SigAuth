import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteContainerDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    @ApiProperty({ example: [1, 2, 3], type: [Number], minItems: 1 })
    containerIds: number[];
}
