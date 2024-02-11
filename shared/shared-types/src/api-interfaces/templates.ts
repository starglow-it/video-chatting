import {
  IBusinessCategory,
  ILanguage,
  ISocialLink,
  IPreviewImage,
} from './common';
import { ITemplateUser } from './users';
import { IMeetingInstance, MeetingRole } from './meeting';

export enum RoomType {
  Normal = 'normal',
  Featured = 'featured',
}

export type TemplateCategoryType = 'default' | 'interior-design';

export type TemplateType = 'video' | 'image';

export type TemplateLink = {
  item: string;
  title: string;
  position: { top: number; left: number };
};

export type meetingLink = {
  url: string;
  users: string[];
};

interface ITemplate {
  authorThumbnail?: string;
  authorRole?: string;
  authorName?: string;
  roomType: RoomType;
  templateType: TemplateType;
  mediaLink: IMediaLink;
  subdomain: string;
  categoryType: TemplateCategoryType;
}

export interface ICommonTemplate extends ITemplate {
  id?: string;
  usedAt?: string;
  templateId: number;
  author?: string;
  customLink?: string;
  name: string;
  maxParticipants: number;
  description: string;
  shortDescription: string;
  url: string;
  draftUrl?: string;
  previewUrls: IPreviewImage[];
  draftPreviewUrls?: IPreviewImage[];
  type: string;
  priceInCents?: number;
  businessCategories?: IBusinessCategory[];
  usersPosition: { bottom: number; left: number }[];
  links?: TemplateLink[];
  stripeProductId?: string;
  isAudioAvailable: boolean;
  draft: boolean;
  isPublic: boolean;
  isDeleted?: boolean;
  isTemplatePurchased?: boolean;
  isAcceptNoLogin?: boolean;
}

export interface IUserTemplate extends ITemplate {
  id: string;
  usedAt?: string;
  templateId: number;
  url: string;
  draftUrl?: string;
  name: string;
  signBoard: string;
  maxParticipants: number;
  description: string;
  shortDescription: string;
  previewUrls: IPreviewImage[];
  type: string;
  priceInCents: number;
  fullName: string;
  companyName: string;
  position: string;
  contactEmail: string;
  isAudioAvailable: boolean;
  customLink: string;
  businessCategories: IBusinessCategory[];
  languages: ILanguage[];
  socials: ISocialLink[];
  user: ITemplateUser;
  usersPosition: { bottom: number; left: number }[];
  usersSize: number[];
  indexUsers: string[];
  links?: TemplateLink[];
  meetingInstance: IMeetingInstance;
  draft: boolean;
  isPublic: boolean;
  author?: string;
  isAcceptNoLogin?: boolean;
  isPublishAudience: boolean;
}

export interface IUpdateTemplate {
  companyName: string;
  contactEmail: string;
  name: string;
  description: string;
  url: string;
  draftUrl: string;
  previewUrls: string[];
  fullName: string;
  position: string;
  signBoard: string;
  customLink: string;
  businessCategories: IBusinessCategory[];
  usersPosition: { bottom: number; left: number }[];
  usersSize: number[];
  indexUsers: string[];
  maxParticipants: number;
  languages: string[];
  isPublic: boolean;
  meetingInstance?: IMeetingInstance;
  mediaLink: IMediaLink;
  links: TemplateLink[];
  socials: {
    youtube: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    custom: string;
  };
  templateType: string;
  subdomain: string;
}

export interface IUpdateUserTemplate extends IUpdateTemplate {
  isPublishAudience: boolean;
}

export interface IUploadTemplateFile {
  url: string;
  mimeType: string;
  previewUrls: IPreviewImage[];
}

export interface ITemplatePayment {
  userTemplate?: string;
  currency: string;
  price: number;
  type: string;
  meetingRole: Exclude<MeetingRole, 'host'>;
  enabled: boolean;
}

export interface IMediaLink {
  src: string;
  thumb: string;
  platform: string;
}
