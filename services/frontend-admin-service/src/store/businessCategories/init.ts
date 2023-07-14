import { sample } from 'effector-next';

import {
    $businessCategoriesStore,
    $businessIdDeleteStore,
    addBusinessCategoriesFx,
    deleteBusinessCategoriesFx,
    deleteBusinessEvent,
    getBusinessCategoriesEvent,
    getBusinessCategoriesFx,
    setBusinessIdDeleteEvent,
    updateBusinessCategoriesFx,
} from './model';

import { handleGetBusinessCategories } from './handlers/handleGetBusinessCategories';
import { handleDeleteBusinessCategories } from './handlers/handleDeleteBusinessCategories';
import { handleUpdateBusinessCategories } from './handlers/handleUpdateBusinessCategories';
import { handleAddBusinessCategories } from './handlers/handleAddBusinessCategories';

getBusinessCategoriesFx.use(handleGetBusinessCategories);
deleteBusinessCategoriesFx.use(handleDeleteBusinessCategories);
updateBusinessCategoriesFx.use(handleUpdateBusinessCategories);
addBusinessCategoriesFx.use(handleAddBusinessCategories);

$businessCategoriesStore.on(
    getBusinessCategoriesFx.doneData,
    (state, payload) => payload ?? state,
);

$businessIdDeleteStore.on(
    setBusinessIdDeleteEvent,
    (_, categoryId) => categoryId,
);

sample({
    clock: getBusinessCategoriesEvent,
    source: getBusinessCategoriesFx.pending,
    filter: isInProgress => !isInProgress,
    fn: (isInProgress, payload) => payload,
    target: getBusinessCategoriesFx,
});

sample({
    clock: [
        updateBusinessCategoriesFx.doneData,
        deleteBusinessCategoriesFx.doneData,
        addBusinessCategoriesFx.doneData,
    ],
    fn: () => ({}),
    target: getBusinessCategoriesEvent,
});

sample({
    clock: deleteBusinessEvent,
    source: $businessIdDeleteStore,
    fn: categoryId => [categoryId],
    target: deleteBusinessCategoriesFx,
});
