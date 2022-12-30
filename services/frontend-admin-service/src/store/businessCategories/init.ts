import {sample} from "effector-next";

import {
	$businessCategoriesStore, getBusinessCategoriesEvent, getBusinessCategoriesFx
} from './model';

import { handleGetBusinessCategories } from './handlers/handleGetBusinessCategories';

getBusinessCategoriesFx.use(handleGetBusinessCategories);

$businessCategoriesStore.on(
	getBusinessCategoriesFx.doneData,
	(state, payload) => payload ?? state,
);

sample({
	clock: getBusinessCategoriesEvent,
	source: getBusinessCategoriesFx.pending,
	filter: (isInProgress) => !isInProgress,
	fn: (isInProgress, payload) => payload,
	target: getBusinessCategoriesFx,
});
