import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Matches, IsOptional } from "class-validator";
import { IMediaCategory, MediaCategoryType } from "shared-types";

export class UpdateMediaCategoryRequest {
    @ApiProperty({
        type: String,
        required: false,
        example: 'onichan'
    })
    @IsOptional()
    @IsString({
        message: 'Invalid Key value'
    })
    @Matches(/^[a-z0-9\W]+$/, {
        message: 'Invalid Key format'
    })
    key: IMediaCategory['key'];

    @ApiProperty({
        type: String,
        required: false,
        example: 'Oni Chan'
    })
    @IsOptional()
    @IsString({
        message: 'Invalid Value value',
    })
    value: IMediaCategory['value'];


    @ApiProperty({
        type: String,
        required: false,
        enum: Object.values(MediaCategoryType)
    })
    @IsOptional()
    @IsString({
        message: 'Invalid Type value',
    })
    @IsEnum(MediaCategoryType,{
        message: 'Invalid Type value'
    })
    type: IMediaCategory['type'];

    @ApiProperty({
        type: String,
        required: false,
        example: '0x1f600'
    })
    @IsOptional()
    @IsString({
        message: 'Invalid Emoji value',
    })
    emojiUrl: IMediaCategory['emojiUrl'];
}