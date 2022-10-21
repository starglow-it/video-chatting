import { Expose, Transform } from 'class-transformer';
import { ISocialLink } from 'shared';

export class CommonSocialLinkDTO implements ISocialLink {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  key: string;

  @Expose()
  value: string;
}
