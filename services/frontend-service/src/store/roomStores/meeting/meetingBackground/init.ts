import { combine, forward, sample } from 'effector';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import { sendUpdateMeetingTemplateSocketEvent } from '../sockets/init';
import { handleGetBackgroundMeeting } from './handlers/handleGetBackground';
import { handleGetCategories } from './handlers/handleGetCategoriesBackground';
import { handleUpdateBackgroundMeeting } from './handlers/handleUpdateBackgroundMeeting';
import { handleUploadNewBackground } from './handlers/handleUploadNewBackground';
import {
    $backgroundMeetingStore,
    setCategoryEvent,
    getBackgroundMeetingFx,
    setMediaEvent,
    updateBackgroundMeetingFx,
    $queryMediasBackgroundStore,
    setQueryMediasEvent,
    $isLoadMoreMediasStore,
    getCategoriesMediasFx,
    uploadNewBackgroundFx,
    addBackgroundToCategoryEvent,
    reloadMediasEvent,
} from './model';

getBackgroundMeetingFx.use(handleGetBackgroundMeeting);
updateBackgroundMeetingFx.use(handleUpdateBackgroundMeeting);
getCategoriesMediasFx.use(handleGetCategories);
uploadNewBackgroundFx.use(handleUploadNewBackground);

$backgroundMeetingStore
    .on([setCategoryEvent, setMediaEvent], (state, data) => ({
        ...state,
        ...data,
    }))
    .on(getBackgroundMeetingFx.doneData, (state, result) => {
        return {
            ...state,
            medias: result.isReset
                ? result.list
                : [...state.medias, ...result.list],
            count: result.count,
        };
    })
    .on(getCategoriesMediasFx.doneData, (state, result) => ({
        ...state,
        categories: result.list,
    }))
    .on(addBackgroundToCategoryEvent, (state, data) => ({
        ...state,
        medias: [...state.medias, data.media],
        count: state.count + 1,
    }));

$queryMediasBackgroundStore
    .on([setQueryMediasEvent], state => ({
        ...state,
        skip: state.skip + 1,
    }))
    .on(reloadMediasEvent, state => ({ ...state, skip: 0 }))
    .reset(setCategoryEvent);

$isLoadMoreMediasStore
    .on(setQueryMediasEvent, () => true)
    .on(getBackgroundMeetingFx, () => false);

sample({
    clock: setCategoryEvent,
    source: combine({
        backgroundMeetingStore: $backgroundMeetingStore,
        meetingTemplateStore: $meetingTemplateStore,
    }),
    fn: ({ backgroundMeetingStore, meetingTemplateStore }) => ({
        id: backgroundMeetingStore.categorySelected,
        userTemplateId: meetingTemplateStore.id,
    }),
    target: getBackgroundMeetingFx,
});

sample({
    clock: setMediaEvent,
    source: combine({
        backgroundMeetingStore: $backgroundMeetingStore,
        meetingTemplateStore: $meetingTemplateStore,
    }),

    fn: ({ meetingTemplateStore, backgroundMeetingStore }, clock) => {
        const dataUpdate = backgroundMeetingStore.medias.find(
            item => item.id === clock.mediaSelected,
        );
        return {
            templateId: meetingTemplateStore.id,
            data: {
                previewUrls: dataUpdate?.previewUrls.map(item => item.id),
                url: dataUpdate?.url,
            },
        };
    },
    target: updateBackgroundMeetingFx,
});

forward({
    from: updateBackgroundMeetingFx.doneData,
    to: sendUpdateMeetingTemplateSocketEvent,
});

sample({
    clock: [setQueryMediasEvent, reloadMediasEvent],
    source: combine({
        backgroundData: $backgroundMeetingStore,
        queryMediasData: $queryMediasBackgroundStore,
        meetingTemplateStore: $meetingTemplateStore,
    }),

    fn: ({
        backgroundData: { categorySelected },
        queryMediasData: { skip, limit },
        meetingTemplateStore: { id },
    }) => ({
        id: categorySelected,
        skip,
        limit,
        userTemplateId: id,
    }),
    target: getBackgroundMeetingFx,
});
