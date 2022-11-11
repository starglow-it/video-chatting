import { IBusinessCategory, QueryParams } from 'shared-types';
import { rootDomain } from '../domains';
import { EntityList } from '../types';

const initialCategoriesStore: EntityList<IBusinessCategory> = {
    list: [],
    count: 0,
};

export const $businessCategoriesStore =
    rootDomain.createStore<EntityList<IBusinessCategory>>(initialCategoriesStore);
export const getBusinessCategoriesFx = rootDomain.createEffect<
    QueryParams,
    EntityList<IBusinessCategory> | undefined | null
>('getBusinessCategoriesFx');
