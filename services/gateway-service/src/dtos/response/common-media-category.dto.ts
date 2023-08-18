import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMediaCategory, MediaCategoryType } from 'shared-types';

export class MediaCategoryRestDTO implements IMediaCategory {
  @Expose()
  @ApiProperty({
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  key: IMediaCategory['key'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  value: IMediaCategory['value'];

  @Expose()
  @ApiProperty({
    type: String,
  })
  emojiUrl: IMediaCategory['emojiUrl'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: MediaCategoryType,
  })
  type: IMediaCategory['type'];
}
