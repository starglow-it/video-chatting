import { IsEnum, IsString, Matches, IsOptional } from "class-validator";
import { IMediaCategory, MediaCategoryType } from "shared-types";

export class UpdateMediaCategoryRequest {

    @IsOptional()
    @IsString({
        message: 'Invalid Key value'
    })
    @Matches(/^[a-z]+$/, {
        message: 'Invalid Key format'
    })
    key: IMediaCategory['key'];

    @IsOptional()
    @IsString({
        message: 'Invalid Value value',
    })
    value: IMediaCategory['value'];

    @IsOptional()
    @IsString({
        message: 'Invalid Type value',
    })
    @IsEnum(MediaCategoryType,{
        message: 'Invalid Type value'
    })
    type: IMediaCategory['type'];
}