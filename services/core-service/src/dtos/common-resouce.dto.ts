import { Expose, Transform, Type } from 'class-transformer';
import { IResouce } from 'shared-types';
import { PreviewImageDTO } from './preview-image.dto';

export class CommonResouceDto implements IResouce {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  name: IResouce['name'];

  @Expose()
  url: IResouce['url'];

  @Expose()
  size: IResouce['size'];

  @Expose()
  @Type(() => PreviewImageDTO)
  previewUrls: IResouce['previewUrls'];

  @Expose()
  mimeType: IResouce['mimeType'];

  @Expose()
  key: IResouce['key'];
}
