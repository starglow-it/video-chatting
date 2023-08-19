import { PreviewImageDocument } from '../schemas/preview-image.schema';

export type PreviewUrls = {
  previewImages: PreviewImageDocument[];
  mediaType: string;
};
