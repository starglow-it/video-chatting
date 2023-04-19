import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMediaCategory, MediaCategoryType } from 'shared-types';

export class MediaCategoryRestDTO implements IMediaCategory {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  key: IMediaCategory['key'];

  @Expose()
  @ApiProperty()
  value: IMediaCategory['value'];

  @Expose()
  @ApiProperty()
  emojiUrl: IMediaCategory['emojiUrl'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: MediaCategoryType
  })
  type: IMediaCategory['type'];

  @Expose()
  @ApiProperty()
  audio: string;
  
}
