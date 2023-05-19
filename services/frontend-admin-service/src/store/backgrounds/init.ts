import { combine, forward, sample } from 'effector';
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
    setCategoryIdDeleteEvent,
    setMediaIdDeleteEvent,
    setQueryMediasEvent,
    updateCategoryFx,
} from './model';
import { handleAddCategory } from './handler/handleAddCategory';
import { handleDeleteCategory } from './handler/handleDeleteCategory';
import { handleUpdateCategory } from './handler/handleUpdateCategory';
import { handleAddMedia } from './handler/handleAddMedia';
import { handleDeleteMedia } from './handler/handleDeleteMedia';
import { addNotificationEvent } from '../notifications/model';
import { NotificationType } from '../types';
import { ResultActionBackground } from './types';

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
    .on(deleteCategoryFx.doneData, (state, { ids, success }) => ({
        ...state,
        categories: success
            ? state.categories.filter(item => !ids.includes(item.id))
            : state.categories,
    }))
    .on(updateCategoryFx.doneData, (state, { category, success }) => ({
        ...state,
        categories: success
            ? state.categories.map(item => {
                  if (item.id === category.id) return category;
                  return item;
              })
            : state.categories,
    }));

$queryFetchMediasStore
    .on(setQueryMediasEvent, state => ({
        ...state,
        skip: state.skip + 1,
    }))
    .reset([selectCategoryEvent, addMediaFx]);

$mediaIdDeleteStore.on(setMediaIdDeleteEvent, (_, mediaId) => mediaId);

$categoryIdDeleteStore.on(
    setCategoryIdDeleteEvent,
    (_, categoryId) => categoryId,
);

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

sample({
    clock: [
        addCategoryFx.doneData,
        addMediaFx.doneData,
        deleteMediaFx.doneData,
        deleteCategoryFx.doneData,
        updateCategoryFx.doneData,
    ],
    fn: (_: any, clock: ResultActionBackground) => ({
        message: clock.message,
        withErrorIcon: !clock.success,
        type: NotificationType.manageBackground,
        withSuccessIcon: clock.success,
    }),
    target: addNotificationEvent,
});

forward({ from: addCategoryFx.doneData, to: getCategoriesFx });
