import { Expose, Transform } from 'class-transformer';
import { IBusinessCategory } from 'shared-types';

export class CommonBusinessCategoryDTO implements IBusinessCategory {
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
