import { Expose, Transform } from 'class-transformer';
import { ILanguage } from 'shared-types';

export class CommonLanguageDTO implements ILanguage {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  key: string;

  @Expose()
  value: string;
}
