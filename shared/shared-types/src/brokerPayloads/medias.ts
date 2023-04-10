import { QueryParams } from "../common";

export type GetMediaCategoriesPayload = QueryParams;

export type GetMediasPayload = {
    mediaCategoryId: string;
} & QueryParams;