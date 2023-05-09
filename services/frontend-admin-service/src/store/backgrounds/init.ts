import { combine, sample } from 'effector';
import { handleGetCategories } from './handler/handleGetCategories';
import { handleGetMedias } from './handler/handleGetMedias';
import {
    $backgroundsManageStore,
    $categoryIdDeleteStore,
    $mediaIdDeleteStore,
    $queryFetchMediasStore,
    addCategoryFx,
    addMediaFx,
    deleteCategoryEvent,
    deleteCategoryFx,
    deleteMediaEvent,
    deleteMediaFx,
    getCategoriesFx,
    getMediasFx,
    selectCategoryEvent,
    setMediaIdDeleteEvent,
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
        medias: data.isReset ? data.list : [...state.medias, ...data.list],
        count: data.count,
    }))
    .on(selectCategoryEvent, (state, categoryId) => ({
        ...state,
        categorySelected: categoryId,
    }))
    .on(addCategoryFx.doneData, (state, category) => ({
        ...state,
        categories: category
            ? [...state.categories, category]
            : state.categories,
    }))
    .on(deleteCategoryFx.doneData, (state, categoryIds) => ({
        ...state,
        categories: state.categories.filter(
            item => !categoryIds.includes(item.id),
        ),
    }))
    .on(updateCategoryFx.doneData, (state, category) => ({
        ...state,
        categories: state.categories.map(item => {
            if (item.id === category.id) return category;
            return item;
        }),
    }));

$queryFetchMediasStore
    .on(setQueryMediasEvent, state => ({
        ...state,
        skip: state.skip + 1,
    }))
    .reset([selectCategoryEvent, addMediaFx]);

$mediaIdDeleteStore.on(setMediaIdDeleteEvent, (_, mediaId) => mediaId);

sample({
    clock: [
        setQueryMediasEvent,
        selectCategoryEvent,
        addMediaFx.doneData,
        deleteMediaFx.doneData,
    ],
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

sample({
    clock: deleteMediaEvent,
    source: combine({
        backgrounds: $backgroundsManageStore,
        mediaIdDelete: $mediaIdDeleteStore,
    }),
    fn: ({ backgrounds, mediaIdDelete }) => ({
        categoryId: backgrounds.categorySelected,
        ids: [mediaIdDelete],
    }),
    target: deleteMediaFx,
});

sample({
    clock: deleteCategoryEvent,
    source: $categoryIdDeleteStore,
    fn: categoryId => ({
        ids: [categoryId],
    }),
    target: deleteCategoryFx,
});
