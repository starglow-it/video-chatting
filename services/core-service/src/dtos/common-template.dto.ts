import { Expose, Transform, Type } from 'class-transformer';

import { IBusinessCategory, ICommonTemplate } from 'shared-types';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { PreviewImageDTO } from './preview-image.dto';

class UserPositionDTO {
  @Expose()
  bottom: number;

  @Expose()
  left: number;
}

export class CommonTemplateDTO implements ICommonTemplate {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  description: ICommonTemplate['description'];

  @Expose()
  shortDescription: ICommonTemplate['shortDescription'];

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  templateId: ICommonTemplate['templateId'];

  @Expose()
  url: ICommonTemplate['url'];

  @Expose()
  draftUrl: ICommonTemplate['draftUrl'];

  @Expose()
  name: ICommonTemplate['name'];

  @Expose()
  maxParticipants: ICommonTemplate['maxParticipants'];

  @Expose()
  @Type(() => PreviewImageDTO)
  previewUrls: ICommonTemplate['previewUrls'];

  @Expose()
  @Type(() => PreviewImageDTO)
  draftPreviewUrls: ICommonTemplate['draftPreviewUrls'];

  @Expose()
  type: ICommonTemplate['type'];

  @Expose()
  priceInCents: ICommonTemplate['priceInCents'];

  @Expose()
  isAudioAvailable: ICommonTemplate['isAudioAvailable'];

  @Expose()
  stripeProductId: ICommonTemplate['stripeProductId'];

  @Expose()
  @Type(() => UserPositionDTO)
  usersPosition: ICommonTemplate['usersPosition'];

  @Expose()
  draft: ICommonTemplate['draft'];

  @Expose()
  isPublic: ICommonTemplate['isPublic'];

  @Expose()
  @Transform((data) => data.obj?.author?.['_id'])
  author: ICommonTemplate['author'];

  @Expose()
  templateType: ICommonTemplate['templateType'];

  @Expose()
  @Transform((data) => Boolean(data.obj?.userTemplate?.[0]?.['_id']))
  isTemplatePurchased: ICommonTemplate['isTemplatePurchased'];

  @Expose()
  @Transform((data) =>
    data.obj?.links?.map((link) => ({
      id: link._id,
      item: link.item,
      position: link.position,
    })),
  )
  links: ICommonTemplate['links'];

  @Expose()
  authorRole: ICommonTemplate['authorRole'];

  @Expose()
  authorThumbnail: ICommonTemplate['authorThumbnail'];

  @Expose()
  isAcceptNoLogin: ICommonTemplate['isAcceptNoLogin'];
}
