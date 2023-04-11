import { Expose, Transform } from 'class-transformer';
import {IMediaCategory } from 'shared-types';

export class CommonMediaCategoryDTO implements IMediaCategory {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  key: string;

  @Expose()
  value: string;

  @Expose()
  emojiUrl: string;
}
