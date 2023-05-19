import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { toNumber } from "src/utils/parsers/toNumber";

export class GetMediasQueryDto {
    @ApiProperty({
        type: Number,
        required: false
    })
    @IsOptional()
    @Transform(({value}) => toNumber(value, 0))
    skip: number;

    @ApiProperty({
        required: false,
        type: Number
    })
    @IsOptional()
    @Transform(({value}) => toNumber(value, 0))
    limit: number;
}