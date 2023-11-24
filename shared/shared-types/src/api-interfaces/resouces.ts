import { IPreviewImage } from './common';

export interface IResouce {
  id?: string;
  url: string;
  name: string;
  size: number;
  previewUrls: IPreviewImage[];
  mimeType: string;
  key: string;
}
