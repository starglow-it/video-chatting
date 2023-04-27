import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsLowercase, IsNotEmpty, IsString, Matches } from "class-validator";
import { IMediaCategory, IUserTemplate, MediaCategoryType } from "shared-types";

export class CreateMediaCategoryRequest {

    @IsNotEmpty({
        message: 'Key must be present'
    })
    @IsString({
        message: 'Invalid Key value'
    })
    @Matches(/^[a-z]+$/, {
        message: 'Invalid Key format'
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

    @IsNotEmpty({
        message: 'Type must be present',
    })
    @IsString({
        message: 'Invalid Type value',
    })
    @IsEnum(MediaCategoryType,{
        message: 'Invalid Type value'
    })
    type: IMediaCategory['type'];
}
