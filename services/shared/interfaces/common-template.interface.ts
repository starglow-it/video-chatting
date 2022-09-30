import { IBusinessCategory } from "./business-category.interface";
import { IPreviewImage } from "./preview-image.interface";

export interface ICommonTemplate {
  id?: string;
  usedAt?: string;
  templateId: number;
  author?: string;
  url: string;
  name: string;
  maxParticipants: number;
  description: string;
  shortDescription: string;
  previewUrls: IPreviewImage[];
  type: string;
  priceInCents?: number;
  businessCategories?: IBusinessCategory[];
  usersPosition: { bottom: number; left: number }[];
  links?: { item: string; position: { top: number; left: number } }[];
  stripeProductId?: string;
  isAudioAvailable: boolean;
  draft: boolean;
  isPublic: boolean;
}
