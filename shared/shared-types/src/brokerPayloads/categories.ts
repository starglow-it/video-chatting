import { IBusinessCategory } from '../api-interfaces';
import { QueryParams} from '../common';


export type GetBusinessCategoriesPayload = QueryParams;

export type UpdateBusinessCategoryPayload = {
    id: string;
    data: Partial<IBusinessCategory>;
}

export type DeletesBusinessCategoriesPayload = {
    ids: string[];
}