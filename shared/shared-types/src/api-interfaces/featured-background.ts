import { IPreviewImage } from './common';
import { ICommonUser, IFeaturedBackgroundUser } from './users';

export interface IFeaturedBackground {
  createdBy: IFeaturedBackgroundUser;
  url: string;
  previewUrls: IPreviewImage[];
  type: string;
}
