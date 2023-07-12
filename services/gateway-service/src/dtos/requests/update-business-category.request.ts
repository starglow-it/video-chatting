import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { IBusinessCategory } from "shared-types";

export class UpdateBusinessCategoryRequest {
    @ApiProperty({
        type: String
    })
    @IsOptional({
        message: 'value must be present',
    })
    @IsString({
        message: 'Invalid value',
    })
    value: IBusinessCategory['value'];

    @IsOptional({
        message: 'Color must be present',
    })
    @IsString({
        message: 'Invalid color value',
    })
    color: string;

    @IsOptional({
        message: 'Icon must be present',
    })
    @IsString({
        message: 'Invalid icon value',
    })
    icon: string;
}