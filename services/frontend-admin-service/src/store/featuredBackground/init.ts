import { sample } from 'effector';
import { handleCreateFeaturedBackground } from './handler/handleCreateFeaturedBackground';
import { handleDeleteFeaturedBackground } from './handler/handleDeleteFeaturedBackground';
import { handleGetFeaturedBackground } from './handler/handleGetFeaturedBackground';
import {
    $featuredBackgroundStore,
    createFeaturedBackgroundFx,
    deleteFeaturedBackground,
    getFeaturedBackgroundFx,
} from './model';

getFeaturedBackgroundFx.use(handleGetFeaturedBackground);
createFeaturedBackgroundFx.use(handleCreateFeaturedBackground);
deleteFeaturedBackground.use(handleDeleteFeaturedBackground);

$featuredBackgroundStore.on(
    getFeaturedBackgroundFx.doneData,
    (_, data) => data,
);

sample({
    clock: [
        createFeaturedBackgroundFx.doneData,
        deleteFeaturedBackground.doneData,
    ],
    fn: () => ({ skip: 0, limit: 6 }),
    target: getFeaturedBackgroundFx,
});
