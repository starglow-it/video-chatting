import { combine, sample } from 'effector';
import { handleGetCategories } from './handler/handleGetCategories';
import { handleGetMedias } from './handler/handleGetMedias';
import {
    $backgroundsManageStore,
    $queryFetchMediasStore,
    addCategoryFx,
    addMediaFx,
    deleteCategoryFx,
    deleteMediaFx,
    getCategoriesFx,
    getMediasFx,
    setQueryMediasEvent,
    updateCategoryFx,
} from './model';
import { handleAddCategory } from './handler/handleAddCategory';
import { handleDeleteCategory } from './handler/handleDeleteCategory';
import { handleUpdateCategory } from './handler/handleUpdateCategory';
import { handleAddMedia } from './handler/handleAddMedia';
import { handleDeleteMedia } from './handler/handleDeleteMedia';

getCategoriesFx.use(handleGetCategories);
getMediasFx.use(handleGetMedias);
addMediaFx.use(handleAddMedia);
deleteMediaFx.use(handleDeleteMedia);
addCategoryFx.use(handleAddCategory);
deleteCategoryFx.use(handleDeleteCategory);
updateCategoryFx.use(handleUpdateCategory);

$backgroundsManageStore
    .on(getCategoriesFx.doneData, (state, data) => ({
        ...state,
        categories: data.list,
    }))
    .on(getMediasFx.doneData, (state, data) => ({
        ...state,
        medias: data.list,
    }))
    .on(addCategoryFx.doneData, (state, category) => ({
        ...state,
        categories: [...state.categories, category],
    }))
    .on(deleteCategoryFx.doneData, (state, categoryId) => ({
        ...state,
        categories: state.categories.filter(item => item.id !== categoryId),
    }))
    .on(updateCategoryFx.doneData, (state, category) => ({
        ...state,
        categories: state.categories.map(item => {
            if (item.id === category.id) return category;
            return item;
        }),
    }))
    .on(addMediaFx.doneData, (state, media) => ({
        ...state,
        medias: [...state.medias, media],
    }))
    .on(deleteMediaFx, (state, mediaId) => ({
        ...state,
        medias: state.medias.filter(item => item.id !== mediaId),
    }));

$queryFetchMediasStore.on(setQueryMediasEvent, state => ({
    ...state,
    skip: state.skip + 1,
}));

sample({
    clock: $queryFetchMediasStore,
    source: combine({
        backgrounds: $backgroundsManageStore,
        query: $queryFetchMediasStore,
    }),
    fn: ({ backgrounds, query }) => ({
        categoryId: backgrounds.categorySelected,
        skip: query.skip,
        limit: query.limit,
    }),
    target: getMediasFx,
});
