import { IBusinessCategory, QueryParams } from 'shared-types';
import { rootDomain, templatesDomain } from '../domains';
import { BusinessCategoriesState } from '../types';

export const $businessCategoriesStore =
    rootDomain.createStore<BusinessCategoriesState>({
        state: {
            list: [],
            count: 0,
        },
        error: null,
    });

export const $businessIdDeleteStore = templatesDomain.createStore<string>('');

export const getBusinessCategoriesFx = rootDomain.createEffect<
    QueryParams,
    BusinessCategoriesState
>('getBusinessCategoriesFx');
export const getBusinessCategoriesEvent =
    templatesDomain.createEvent<QueryParams>('getBusinessCategoriesEvent');

export const updateBusinessCategoriesFx = templatesDomain.createEffect<
    IBusinessCategory & { id: string },
    void
>('updateBusinessCategoriesEvent');

export const deleteBusinessCategoriesFx = templatesDomain.createEffect<
    string[],
    void
>('deleteBusinessCategoriesEvent');

export const deleteBusinessEvent = templatesDomain.createEvent(
    'deleteBusinessEvent',
);

export const addBusinessCategoriesFx = templatesDomain.createEffect<
    IBusinessCategory,
    void
>('addBusinessCategoriesFx');

export const setBusinessIdDeleteEvent = templatesDomain.createEvent<string>(
    'setBusinessIdDeleteEvent',
);
