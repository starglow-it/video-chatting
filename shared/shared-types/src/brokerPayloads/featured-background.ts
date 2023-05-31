import { ICommonUser, IFeaturedBackground } from "../api-interfaces";
import { QueryParams } from "../common";


export type GetFeaturedBackgroundPayload = QueryParams;


export type UploadFeaturedBackgroundPayload = {
    url: IFeaturedBackground['url'];
    id: string;
    mimeType: string;
};

export type DeleteFeaturedBackgroundPayload = {
    ids: string[];
}

export type CreateFeaturedBackgroundPayload = {
    userId: ICommonUser['id'];
}
