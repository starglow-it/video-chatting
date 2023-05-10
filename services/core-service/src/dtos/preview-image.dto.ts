import { Expose, Transform } from 'class-transformer';

import { IPreviewImage } from 'shared-types';

export class PreviewImageDTO implements IPreviewImage {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  url: IPreviewImage['url'];

  @Expose()
  mimeType: IPreviewImage['mimeType'];

  @Expose()
  size: IPreviewImage['size'];

  @Expose()
  resolution: IPreviewImage['resolution'];

  @Expose()
  key: IPreviewImage['key'];
}
