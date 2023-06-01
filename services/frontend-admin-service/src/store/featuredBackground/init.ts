import { handleCreateFeaturedBackground } from './handler/handleCreateFeaturedBackground';
import { handleDeleteFeaturedBackground } from './handler/handleDeleteFeaturedBackground';
import { handleGetFeaturedBackground } from './handler/handleGetFeaturedBackground';
import {
    createFeaturedBackgroundFx,
    deleteFeaturedBackground,
    getFeaturedBackgroundFx,
} from './model';

getFeaturedBackgroundFx.use(handleGetFeaturedBackground);
createFeaturedBackgroundFx.use(handleCreateFeaturedBackground);
deleteFeaturedBackground.use(handleDeleteFeaturedBackground);
