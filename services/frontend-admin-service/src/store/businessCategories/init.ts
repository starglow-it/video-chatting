import { $businessCategoriesStore, getBusinessCategoriesFx } from './model';
import { handleGetBusinessCategories } from './handlers/handleGetBusinessCategories';

getBusinessCategoriesFx.use(handleGetBusinessCategories);

$businessCategoriesStore.on(getBusinessCategoriesFx.doneData, (state, payload) => payload ?? state);
