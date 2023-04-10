import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMediaCategory } from 'shared-types';

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
}
