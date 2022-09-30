import { IBusinessCategory } from "./business-category.interface";
import { ILanguage } from "./common-language.interface";
import { ISocialLink } from "./common-social-link.interface";
import { ITemplateUser } from "./template-user.interface";
import { IPreviewImage } from "./preview-image.interface";
import {ICommonMeetingInstance} from "./common-instance-meeting.interface";

export interface IUserTemplate {
  id: string;
  usedAt?: string;
  templateId: number;
  url: string;
  name: string;
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
  meetingInstance: ICommonMeetingInstance,
  draft: boolean;
  isPublic: boolean;
  author?: string;
}
