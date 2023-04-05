import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IBusinessMedia, IPreviewImage } from 'shared-types';

export class BusinessMediaRestDTO implements IBusinessMedia {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    businessCategory: IBusinessMedia['businessCategory'];

    @Expose()
    @ApiProperty()
    url: IBusinessMedia['url'];

    @Expose()
    @ApiProperty()
    previewUrls: IPreviewImage[];

}
