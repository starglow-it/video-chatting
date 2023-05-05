import { backgroundsDomain } from '../domains';

export const $backgroundsManageStore = backgroundsDomain.createStore<{
    categories: any[];
    categorySelected: any;
    medias: any[];
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
}>({ skip: 0, limit: 0 });

export const setQueryMediasEvent = backgroundsDomain.createEvent(
    'setQueryMediasEvent',
);

export const getCategoriesFx = backgroundsDomain.createEffect<void, void>(
    'getCategoriesFx',
);

export const addCategoryFx = backgroundsDomain.createEffect<void, void>(
    'addCategoryFx',
);

export const deleteCategoryFx = backgroundsDomain.createEffect<void, void>(
    'deleteCategoryFx',
);

export const updateCategoryFx = backgroundsDomain.createEffect<void, void>(
    'updateCategoryFx',
);

export const getMediasFx = backgroundsDomain.createEffect<void, void>(
    'getMediasFx',
);

export const addMediaFx = backgroundsDomain.createEffect<void, void>(
    'addMediaFx',
);

export const deleteMediaFx = backgroundsDomain.createEffect<void, void>(
    'deleteMediaFx',
);
