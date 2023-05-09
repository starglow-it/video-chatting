import { EntityList, IMediaCategory } from 'shared-types';
import { backgroundsDomain } from '../domains';
import {
    DeleteMediaParams,
    GetMediasParams,
    IBackgroundCategory,
    IBackgroundMedia,
    ResultGetCategories,
    UploadMediaParams,
} from './types';

export const $backgroundsManageStore = backgroundsDomain.createStore<{
    categories: IBackgroundCategory[];
    categorySelected: string | null;
    medias: IBackgroundMedia[];
    count: number;
}>({
    categories: [],
    categorySelected: null,
    medias: [],
    count: 0,
});

export const $queryFetchMediasStore = backgroundsDomain.createStore<{
    skip: number;
    limit: number;
}>({ skip: 0, limit: 12 });

export const setQueryMediasEvent = backgroundsDomain.createEvent(
    'setQueryMediasEvent',
);

export const getCategoriesFx = backgroundsDomain.createEffect<
    void,
    EntityList<IBackgroundCategory>
>('getCategoriesFx');

export const addCategoryFx = backgroundsDomain.createEffect<
    IMediaCategory,
    IBackgroundCategory | null
>('addCategoryFx');

export const deleteCategoryFx = backgroundsDomain.createEffect<
    { ids: string[] },
    string[]
>('deleteCategoryFx');

export const updateCategoryFx = backgroundsDomain.createEffect<
    IBackgroundCategory,
    IBackgroundCategory
>('updateCategoryFx');

export const getMediasFx = backgroundsDomain.createEffect<
    GetMediasParams,
    ResultGetCategories
>('getMediasFx');

export const addMediaFx = backgroundsDomain.createEffect<
    UploadMediaParams,
    boolean
>('addMediaFx');

export const deleteMediaFx = backgroundsDomain.createEffect<
    DeleteMediaParams,
    boolean
>('deleteMediaFx');

export const selectCategoryEvent = backgroundsDomain.createEvent<string>(
    'selectCategoryEvent',
);
