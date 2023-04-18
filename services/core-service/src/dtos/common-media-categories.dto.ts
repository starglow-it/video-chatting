import { Expose, Transform } from 'class-transformer';
import {IMediaCategory } from 'shared-types';

export class CommonMediaCategoryDTO implements IMediaCategory {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  key: IMediaCategory['key'];

  @Expose()
  value: IMediaCategory['value'];

  @Expose()
  emojiUrl: IMediaCategory['emojiUrl'];

  @Expose()
  type: IMediaCategory['type'];
}
