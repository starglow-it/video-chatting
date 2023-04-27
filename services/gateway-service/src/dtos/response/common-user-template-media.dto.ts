import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IPreviewImage, IUserTemplateMedia } from "shared-types";
import { MediaCategoryRestDTO } from "./common-media-category.dto";

class PreviewImageDTO implements IPreviewImage {
    @Expose()
    @ApiProperty({
        type: String
    })
    id: string;
  
    @Expose()
    @ApiProperty({
        type: String
    })
    url: IPreviewImage['url'];
  
    @Expose()
    @ApiProperty({
        type: String
    })
    mimeType: IPreviewImage['mimeType'];
  
    @Expose()
    @ApiProperty({
        type: String
    })
    size: IPreviewImage['size'];
  
    @Expose()
    @ApiProperty({
        type: Number
    })
    resolution: IPreviewImage['resolution'];
  
    @Expose()
    @ApiProperty({
        type: String
    })
    key: IPreviewImage['key'];
  }

export class UserTemplateMediaRestDto implements IUserTemplateMedia {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty({
        type: MediaCategoryRestDTO
    })
    mediaCategory: IUserTemplateMedia['mediaCategory'];
    
    @Expose()
    @ApiProperty({
        type: String
    })
    name: IUserTemplateMedia['name'];

    @Expose()
    @ApiProperty({
        type: String
    })
    url: IUserTemplateMedia['url'];

    @Expose()
    @ApiProperty({
        type: [PreviewImageDTO]
    })
    previewUrls: IPreviewImage[];

    @Expose()
    @ApiProperty({
        type: String
    })
    type: IUserTemplateMedia['type'];

    @Expose()
    @ApiProperty({
        type: String
    })
    userTemplate: IUserTemplateMedia['userTemplate'];
}