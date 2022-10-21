import { Expose, Transform } from 'class-transformer';

import { IPreviewImage } from 'shared';

export class PreviewImageDTO implements IPreviewImage {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  url: string;

  @Expose()
  mimeType: string;

  @Expose()
  size: number;

  @Expose()
  resolution: number;
}
