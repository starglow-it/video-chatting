import { Expose, Transform } from 'class-transformer';
import { ISocialLink } from '@shared/interfaces/common-social-link.interface';

export class CommonSocialLinkDTO implements ISocialLink {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  key: string;

  @Expose()
  value: string;
}
