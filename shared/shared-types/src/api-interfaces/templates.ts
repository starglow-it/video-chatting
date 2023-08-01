import {
  IBusinessCategory,
  ILanguage,
  ISocialLink,
  IPreviewImage,
  TemplateLinkPosition,
} from './common';
import { ITemplateUser } from './users';
import { IMeetingInstance } from './meeting';

export enum RoomType {
  Normal = 'normal',
  Featured = 'featured'
}

interface ITemplate{
  authorThumbnail?: string;
  authorRole?: string;
  authorName?: string;
  roomType: RoomType;
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
  links?: { item: string; position: TemplateLinkPosition }[];
  stripeProductId?: string;
  isAudioAvailable: boolean;
  draft: boolean;
  isPublic: boolean;
  isDeleted?: boolean;
  templateType: 'image' | 'video';
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
  isMonetizationEnabled: boolean;
  isAudioAvailable: boolean;
  templatePrice: number;
  templateCurrency: string;  
  paywallPrice: number | null,
  paywallCurrency: string,
  customLink: string;
  businessCategories: IBusinessCategory[];
  languages: ILanguage[];
  socials: ISocialLink[];
  user: ITemplateUser;
  usersPosition: { bottom: number; left: number }[];
  usersSize: number[];
  indexUsers: string[];
  links?: { item: string; position: { top: number; left: number } }[];
  meetingInstance: IMeetingInstance;
  draft: boolean;
  isPublic: boolean;
  author?: string;
  isAcceptNoLogin?: boolean;
  templateType: 'video' | 'image';
}

export interface IUpdateTemplate {
  companyName: string;
  contactEmail: string;
  name?: string;
  description: string;
  url?: string;
  draftUrl?: string;
  previewUrls?: string[];
  fullName: string;
  position: string;
  signBoard: string;
  customLink?: string;
  businessCategories?: IBusinessCategory[];
  usersPosition?: { bottom: number; left: number }[];
  usersSize?: number[];
  indexUsers?: string[];
  maxParticipants?: number;
  languages?: string[];
  isMonetizationEnabled?: boolean;
  isPublic?: boolean;
  templatePrice?: number;
  templateCurrency?: string;
  paywallCurrency?: string;
  paywallPrice?: number;
  meetingInstance?: IMeetingInstance;
  links?: { item: string; position: { top: number; left: number } }[];
  socials: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    custom?: string;
  };
  templateType?: string;
}

export interface IUploadTemplateFile {
  url: string;
  mimeType: string;
  previewUrls: IPreviewImage[];
}
