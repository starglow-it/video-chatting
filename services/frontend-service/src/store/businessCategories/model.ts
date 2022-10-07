import { rootDomain } from '../domains';
import { BusinessCategory, EntityList } from '../types';

const initialCategoriesStore: EntityList<BusinessCategory> = {
    list: [],
    count: 0,
};

export const $businessCategoriesStore =
    rootDomain.createStore<EntityList<BusinessCategory>>(initialCategoriesStore);
export const getBusinessCategoriesFx = rootDomain.createEffect<
    { skip: number; limit: number },
    EntityList<BusinessCategory> | undefined | null
>('getBusinessCategoriesFx');
