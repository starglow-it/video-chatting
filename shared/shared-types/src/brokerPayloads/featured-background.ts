import { ICommonUser, IFeaturedBackground } from "../api-interfaces";
import { QueryParams } from "../common";


export type GetFeaturedBackgroundsPayload = QueryParams;


export type UploadFeaturedBackgroundPayload = {
    url: IFeaturedBackground['url'];
    id: string;
    mimeType: string;
};

export type DeleteFeaturedBackgroundsPayload = {
    ids: string[];
}

export type CreateFeaturedBackgroundPayload = {
    userId: ICommonUser['id'];
}
