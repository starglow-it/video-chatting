import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { MediaCategoryType } from "shared-types";
import { toNumber } from "../../utils/parsers/toNumber";

export class GetAdminMediaCategoriesQueryDto {
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

    @ApiProperty({
        type: String,
        enum: MediaCategoryType
    })
    @IsNotEmpty()
    type: string;

}