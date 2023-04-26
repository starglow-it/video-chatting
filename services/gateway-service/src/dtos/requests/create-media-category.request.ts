import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsNotEmpty, IsString } from "class-validator";
import { IMediaCategory, IUserTemplate } from "shared-types";

export class CreateMediaCategoryRequest {

    @ApiProperty({
        type: String,
        example: 'onichan'
    })
    @IsNotEmpty({
        message: 'Key must be present',
    })
    @IsString({
        message: 'Invalid Key value',
    })
    @IsLowercase({
        message: 'Key must be lower case'
    })
    key: IMediaCategory['key'];

    @ApiProperty({
        type: String,
        example: 'Oni Chan'
    })
    @IsNotEmpty({
        message: 'Value must be present',
    })
    @IsString({
        message: 'Invalid Value value',
    })
    value: IMediaCategory['value'];

    @ApiProperty({
        type: String,
        example: 'Oni Chan'
    })
    @IsNotEmpty({
        message: 'Type must be present',
    })
    @IsString({
        message: 'Invalid Type value',
    })
    type: IMediaCategory['type'];
}
