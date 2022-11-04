import { rootDomain } from '../domains';
import { EntityList } from '../types';
import { IBusinessCategory } from 'shared-types';

const initialCategoriesStore: EntityList<IBusinessCategory> = {
    list: [],
    count: 0,
};

export const $businessCategoriesStore =
    rootDomain.createStore<EntityList<IBusinessCategory>>(initialCategoriesStore);
export const getBusinessCategoriesFx = rootDomain.createEffect<
    { skip: number; limit: number },
    EntityList<IBusinessCategory> | undefined | null
>('getBusinessCategoriesFx');
