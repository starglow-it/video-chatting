import { IPreviewImage } from "./common";
import { ICommonUser } from "./users";

export interface IFeaturedBackground {
    createdBy: ICommonUser;
    url: string;
    previewUrls: IPreviewImage[];
    type: string;
}