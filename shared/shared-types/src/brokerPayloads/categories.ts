import { QueryParams } from '../common';

export type GetBusinessCategoriesPayload = QueryParams;

export type GetBusinessMediasPayload = {
    businessCategoryId: string;
} & QueryParams;