import { handleGetFeaturedBackground } from './handler/handleGetFeaturedBackground';
import { $featuredBackgroundStore, getFeaturedBackgroundFx } from './model';

getFeaturedBackgroundFx.use(handleGetFeaturedBackground);

$featuredBackgroundStore.on(
    getFeaturedBackgroundFx.doneData,
    (_, data) => data,
);
