import { Expose, Transform, Type } from 'class-transformer';

// dtos
import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';
import { CommonMeetingDTO } from './common-meeting.dto';
import { TemplateUserDTO } from './template-user.dto';

// interfaces
import {
  IMeetingInstance,
  ITemplateUser,
  IUserTemplate,
  ISocialLink,
  ILanguage,
  IBusinessCategory,
  TemplateLink,
} from 'shared-types';

import { PreviewImageDTO } from './preview-image.dto';
import { Document } from 'mongoose';

export class UserTemplateDTO implements IUserTemplate {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  description: IUserTemplate['description'];

  @Expose()
  shortDescription: IUserTemplate['shortDescription'];

  @Expose()
  usedAt: IUserTemplate['usedAt'];

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  @Type(() => CommonMeetingDTO)
  meetingInstance: IMeetingInstance;

  @Expose()
  templateId: IUserTemplate['templateId'];

  @Expose()
  url: IUserTemplate['url'];

  @Expose()
  draftUrl: IUserTemplate['draftUrl'];

  @Expose()
  name: IUserTemplate['name'];

  @Expose()
  maxParticipants: IUserTemplate['maxParticipants'];

  @Expose()
  @Transform((data) => data.obj?.mediaLink)
  mediaLink: IUserTemplate['mediaLink'];

  @Expose()
  @Type(() => PreviewImageDTO)
  previewUrls: IUserTemplate['previewUrls'];

  @Expose()
  @Type(() => PreviewImageDTO)
  draftPreviewUrls: IUserTemplate['previewUrls'];

  @Expose()
  type: IUserTemplate['type'];

  @Expose()
  fullName: IUserTemplate['fullName'];

  @Expose()
  companyName: IUserTemplate['companyName'];

  @Expose()
  position: IUserTemplate['position'];

  @Expose()
  contactEmail: IUserTemplate['contactEmail'];

  @Expose()
  @Type(() => CommonLanguageDTO)
  languages: ILanguage[];

  @Expose()
  @Type(() => CommonSocialLinkDTO)
  socials: ISocialLink[];

  @Expose()
  @Type(() => TemplateUserDTO)
  user: ITemplateUser;

  @Expose()
  signBoard: IUserTemplate['signBoard'];

  @Expose()
  customLink: IUserTemplate['customLink'];

  @Expose()
  isAudioAvailable: IUserTemplate['isAudioAvailable'];

  @Expose()
  priceInCents: IUserTemplate['priceInCents'];

  @Expose()
  @Transform((data) => data.obj?.usersPosition)
  usersPosition: IUserTemplate['usersPosition'];

  @Expose()
  usersSize: IUserTemplate['usersSize'];

  @Expose()
  indexUsers: IUserTemplate['indexUsers'];

  @Expose()
  @Transform((data) =>
    (data.obj?.links as (TemplateLink & Document)[])?.map<TemplateLink>(
      (link) => ({
        id: link._id,
        title: link.title,
        item: link.item,
        position: link.position,
      }),
    ),
  )
  links: IUserTemplate['links'];

  @Expose()
  isPublic: IUserTemplate['isPublic'];

  @Expose()
  templateType: IUserTemplate['templateType'];

  @Expose()
  draft: IUserTemplate['draft'];

  @Expose()
  @Transform((data) => data.obj?.author?.['_id'])
  author: IUserTemplate['author'];

  @Expose()
  authorRole: IUserTemplate['authorRole'];

  @Expose()
  authorThumbnail: IUserTemplate['authorThumbnail'];

  @Expose()
  authorName: IUserTemplate['authorName'];

  @Expose()
  isAcceptNoLogin?: IUserTemplate['isAcceptNoLogin'];

  @Expose()
  roomType: IUserTemplate['roomType'];

  @Expose()
  subdomain: IUserTemplate['subdomain'];

  @Expose()
  categoryType: IUserTemplate['categoryType'];
}
