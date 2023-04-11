import { combine, forward, sample } from 'effector';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import { sendUpdateMeetingTemplateSocketEvent } from '../sockets/init';
import { handleGetBackgroundMeeting } from './handlers/handleGetBackground';
import { handleGetCategories } from './handlers/handleGetCategoriesBackground';
import { handleUpdateBackgroundMeeting } from './handlers/handleUpdateBackgroundMeeting';
import {
    $backgroundMeetingStore,
    $isToggleChangeBackground,
    toggleChangeBackgroundEvent,
    setCategoryEvent,
    getBackgroundMeetingFx,
    setMediaEvent,
    updateBackgroundMeetingFx,
    $queryMediasBackgroundStore,
    setQueryMediasEvent,
    $isLoadMoreMediasStore,
    getCategoriesMediasFx,
} from './model';

getBackgroundMeetingFx.use(handleGetBackgroundMeeting);
updateBackgroundMeetingFx.use(handleUpdateBackgroundMeeting);
getCategoriesMediasFx.use(handleGetCategories);

$isToggleChangeBackground.on(toggleChangeBackgroundEvent, toggle => !toggle);

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
    }));

$queryMediasBackgroundStore
    .on(setQueryMediasEvent, state => ({
        ...state,
        skip: state.skip + 1,
    }))
    .reset(setCategoryEvent);

$isLoadMoreMediasStore
    .on(setQueryMediasEvent, () => true)
    .on(getBackgroundMeetingFx, () => false);

sample({
    clock: setCategoryEvent,
    source: $backgroundMeetingStore,
    fn: source => ({ id: source.categorySelected }),
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
    clock: setQueryMediasEvent,
    source: combine({
        backgroundData: $backgroundMeetingStore,
        queryMediasData: $queryMediasBackgroundStore,
    }),

    fn: ({
        backgroundData: { categorySelected },
        queryMediasData: { skip, limit },
    }) => ({
        id: categorySelected,
        skip,
        limit,
    }),
    target: getBackgroundMeetingFx,
});
