import { IPreviewImage } from './preview-image.interface';
import { IBusinessCategory } from './business-category.interface';

export interface IUploadTemplateFile {
    url: string;
    mimeType: string;
    previewUrls: IPreviewImage[];
}
