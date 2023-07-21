import { IBusinessCategory } from '../api-interfaces';
import { QueryParams} from '../common';


export type GetBusinessCategoriesPayload = QueryParams;

export type CreateBusinessCategoryPayload = {
    key: IBusinessCategory['key'];
    value: IBusinessCategory['value'];
    color: IBusinessCategory['color'];
    icon: IBusinessCategory['icon'];
}

export type UpdateBusinessCategoryPayload = {
    id: string;
    data: Partial<IBusinessCategory>;
}

export type DeletesBusinessCategoriesPayload = {
    ids: string[];
}