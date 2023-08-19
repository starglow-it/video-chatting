import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IPreviewImage } from 'shared-types';

export class PreviewImageDTO implements IPreviewImage {
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
