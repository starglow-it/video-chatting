import { Expose, Transform, Type } from 'class-transformer';

import { IBusinessCategory } from '@shared/interfaces/business-category.interface';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';

export class CommonTemplateDTO implements ICommonTemplate {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  templateId: number;

  @Expose()
  url: string;

  @Expose()
  name: string;

  @Expose()
  maxParticipants: number;

  @Expose()
  previewUrl: string;

  @Expose()
  type: string;

  @Expose()
  usersPosition: { top: number; left: number }[];
}
