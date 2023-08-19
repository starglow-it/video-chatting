import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IPreviewImage, IMedia } from 'shared-types';
import { MediaCategoryRestDTO } from './common-media-category.dto';

class PreviewImageDTO implements IPreviewImage {
  @Expose()
  @ApiProperty({
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  url: IPreviewImage['url'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  mimeType: IPreviewImage['mimeType'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  size: IPreviewImage['size'];

  @Expose()
  @ApiProperty({
    type: Number,
  })
  resolution: IPreviewImage['resolution'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  key: IPreviewImage['key'];
}

export class CommonMediaRestDto implements IMedia {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    type: MediaCategoryRestDTO,
  })
  mediaCategory: IMedia['mediaCategory'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  name: IMedia['name'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  url: IMedia['url'];

  @Expose()
  @ApiProperty({
    type: [PreviewImageDTO],
  })
  previewUrls: IPreviewImage[];

  @Expose()
  @ApiProperty({
    type: String,
  })
  type: IMedia['type'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  userTemplate: IMedia['userTemplate'];
}
