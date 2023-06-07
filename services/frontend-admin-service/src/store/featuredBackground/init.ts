import { sample } from 'effector';
import { handleCreateFeaturedBackground } from './handler/handleCreateFeaturedBackground';
import { handleDeleteFeaturedBackground } from './handler/handleDeleteFeaturedBackground';
import { handleGetFeaturedBackground } from './handler/handleGetFeaturedBackground';
import {
    $featuredBackgroundStore,
    createFeaturedBackgroundFx,
    deleteFeaturedBackground,
    getFeaturedBackgroundFx,
    getFeaturedTemplatesFx,
} from './model';
import { handleGetFeaturedTemplates } from './handler/handleGetFeaturedTemplates';
import { RoomType } from 'shared-types';
import { deleteCommonTemplateFx } from '../templates/model';

getFeaturedBackgroundFx.use(handleGetFeaturedBackground);
createFeaturedBackgroundFx.use(handleCreateFeaturedBackground);
deleteFeaturedBackground.use(handleDeleteFeaturedBackground);
getFeaturedTemplatesFx.use(handleGetFeaturedTemplates);

$featuredBackgroundStore
    .on(getFeaturedTemplatesFx.doneData, (_, data) => data.state)
    .on(deleteCommonTemplateFx.done, (state, { params }) => ({
        count: state.count - 1,
        list: state.list.filter(template => template?.id !== params.templateId),
    }));

sample({
    clock: [
        createFeaturedBackgroundFx.doneData,
        deleteFeaturedBackground.doneData,
    ],
    fn: () => ({ skip: 0, limit: 9, roomType: RoomType.Featured }),
    target: getFeaturedTemplatesFx,
});
