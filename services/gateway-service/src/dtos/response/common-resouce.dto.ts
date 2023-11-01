import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IPreviewImage, IResouce } from 'shared-types';
import { PreviewImageDTO } from './common.dto';

export class CommonResouceResDto implements IResouce {
  @Expose()
  @ApiProperty({
    type: Number,
  })
  size: number;

  @Expose()
  @ApiProperty({
    type: String,
  })
  mimeType: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  key: string;
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  name: IResouce['name'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  url: IResouce['url'];

  @Expose()
  @ApiProperty({
    type: [PreviewImageDTO],
  })
  previewUrls: IPreviewImage[];
}
