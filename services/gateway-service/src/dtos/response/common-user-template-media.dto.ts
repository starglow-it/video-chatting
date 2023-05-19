import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IPreviewImage, IUserTemplateMedia } from "shared-types";

export class UserTemplateMediaRestDto implements IUserTemplateMedia {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    mediaCategory: IUserTemplateMedia['mediaCategory'];
    
    @Expose()
    @ApiProperty()
    name: IUserTemplateMedia['name'];

    @Expose()
    @ApiProperty()
    url: IUserTemplateMedia['url'];

    @Expose()
    @ApiProperty()
    previewUrls: IPreviewImage[];

    @Expose()
    @ApiProperty()
    type: IUserTemplateMedia['type'];

    @Expose()
    @ApiProperty()
    userTemplate: IUserTemplateMedia['userTemplate'];
}