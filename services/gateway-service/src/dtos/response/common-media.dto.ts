import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {IMedia, IPreviewImage } from 'shared-types';

export class MediaRestDTO implements IMedia {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    mediaCategory: IMedia['mediaCategory'];

    @Expose()
    @ApiProperty()
    url: IMedia['url'];

    @Expose()
    @ApiProperty()
    previewUrls: IPreviewImage[];

    @Expose()
    @ApiProperty()
    type: IMedia['type'];

}
