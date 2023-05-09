import { EntityList, IMediaCategory } from 'shared-types';
import { backgroundsDomain } from '../domains';
import {
    DeleteMediaParams,
    GetMediasParams,
    IBackgroundCategory,
    IBackgroundMedia,
    ResultActionBackground,
    ResultDeleteCategory,
    ResultGetCategories,
    ResultUpdateCategory,
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

export const $mediaIdDeleteStore = backgroundsDomain.createStore<string>('');

export const $categoryIdDeleteStore = backgroundsDomain.createStore<string>('');

export const setQueryMediasEvent = backgroundsDomain.createEvent(
    'setQueryMediasEvent',
);

export const getCategoriesFx = backgroundsDomain.createEffect<
    void,
    EntityList<IBackgroundCategory>
>('getCategoriesFx');

export const addCategoryFx = backgroundsDomain.createEffect<
    IMediaCategory,
    ResultActionBackground
>('addCategoryFx');

export const deleteCategoryFx = backgroundsDomain.createEffect<
    { ids: string[] },
    ResultDeleteCategory
>('deleteCategoryFx');

export const updateCategoryFx = backgroundsDomain.createEffect<
    IBackgroundCategory,
    ResultUpdateCategory
>('updateCategoryFx');

export const getMediasFx = backgroundsDomain.createEffect<
    GetMediasParams,
    ResultGetCategories
>('getMediasFx');

export const addMediaFx = backgroundsDomain.createEffect<
    UploadMediaParams,
    ResultActionBackground
>('addMediaFx');

export const deleteMediaFx = backgroundsDomain.createEffect<
    DeleteMediaParams,
    ResultActionBackground
>('deleteMediaFx');

export const deleteMediaEvent =
    backgroundsDomain.createEvent('deleteMediaEvent');

export const selectCategoryEvent = backgroundsDomain.createEvent<string>(
    'selectCategoryEvent',
);

export const setMediaIdDeleteEvent = backgroundsDomain.createEvent<string>(
    'setMediaIdDeleteEvent',
);

export const deleteCategoryEvent = backgroundsDomain.createEvent(
    'deleteCategoryEvent',
);

export const setCategoryIdDeleteEvent = backgroundsDomain.createEvent<string>(
    'setCategoryIdDeleteEvent',
);
