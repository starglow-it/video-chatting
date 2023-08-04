import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { toNumber } from "src/utils/parsers/toNumber";

export class CreateUserFreeRequest {
    @ApiProperty({
        type: String,
        description: 'This field must be string'
    })
    @IsOptional({
        message: 'templateId must be present'
    })
    @IsString()
    readonly templateId: string;

    @ApiProperty({
        type: String,
        description: 'This field must be string'
    })
    @IsOptional({
        message: 'subdomain must be present'
    })
    @IsString()
    readonly subdomain: string;
}