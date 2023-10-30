import { Expose, Transform, Type } from 'class-transformer';
import { IMedia } from 'shared-types';
import { CommonMediaCategoryDTO } from './common-media-categories.dto';
import { PreviewImageDTO } from './preview-image.dto';
import { UserTemplateDTO } from './user-template.dto';

export class CommonMediaDTO implements IMedia {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => CommonMediaCategoryDTO)
  mediaCategory: IMedia['mediaCategory'];

  @Expose()
  name: IMedia['name'];

  @Expose()
  url: string;

  @Expose()
  @Type(() => PreviewImageDTO)
  previewUrls: IMedia['previewUrls'];

  @Expose()
  type: IMedia['type'];

  @Expose()
  @Type(() => UserTemplateDTO)
  userTemplate: IMedia['userTemplate'];


  @Expose()
  thumb: IMedia['thumb'];
}
