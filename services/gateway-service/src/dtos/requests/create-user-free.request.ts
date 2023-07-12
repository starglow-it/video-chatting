import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { toNumber } from "src/utils/parsers/toNumber";

export class CreateUserFreeRequest {
    @ApiProperty({
        type: String,
        description: 'This field must be number'
    })
    @IsOptional({
        message: 'templateId must be present'
    })
    @IsNumber()
    @Transform(({value}) => toNumber(value, 0))
    readonly templateId: number;
}