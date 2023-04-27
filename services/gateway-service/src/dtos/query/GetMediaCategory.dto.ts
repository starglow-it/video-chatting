import { IsNotEmpty, IsString } from "class-validator";

export class MediaCategoryQueryDto {
    @IsNotEmpty({
        message: 'Media Category mus be not empty'
    })
    @IsString({
        message: 'Media Category must be a string'
    })
    mediaCategoryId: string;
}