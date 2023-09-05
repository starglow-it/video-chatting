import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IPreviewImage, IMedia } from 'shared-types';
import { MediaCategoryRestDTO } from './common-media-category.dto';
import { PreviewImageDTO } from './common.dto';

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
