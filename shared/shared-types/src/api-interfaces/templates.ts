import {
  IBusinessCategory,
  ILanguage,
  ISocialLink,
  IPreviewImage,
  ITemplateSoundFile,
  TemplateLinkPosition,
} from './common';
import { ITemplateUser } from './users';
import { IMeetingInstance } from './meeting';

export interface ICommonTemplate {
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
}

export interface IUserTemplate {
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
  customLink: string;
  businessCategories: IBusinessCategory[];
  languages: ILanguage[];
  socials: ISocialLink[];
  user: ITemplateUser;
  usersPosition: { bottom: number; left: number }[];
  links?: { item: string; position: { top: number; left: number } }[];
  meetingInstance: IMeetingInstance;
  draft: boolean;
  isPublic: boolean;
  author?: string;
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
  maxParticipants?: number;
  languages?: string[];
  isMonetizationEnabled?: boolean;
  isPublic?: boolean;
  templatePrice?: number;
  templateCurrency?: string;
  meetingInstance?: IMeetingInstance;
  socials: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    custom?: string;
  };
}

export interface IUploadTemplateFile {
  url: string;
  mimeType: string;
  previewUrls: IPreviewImage[];
}
