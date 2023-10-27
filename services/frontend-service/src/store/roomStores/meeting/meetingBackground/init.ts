import { combine, forward, sample } from 'effector';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { resetRoomStores } from 'src/store/root';
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
    deleteMediaMeetingFx,
} from './model';
import { handleDeleteMediaMeeting } from './handlers/handleDeleteMedia';
import { ResultDeleteMedia } from './types';

getBackgroundMeetingFx.use(handleGetBackgroundMeeting);
updateBackgroundMeetingFx.use(handleUpdateBackgroundMeeting);
getCategoriesMediasFx.use(handleGetCategories);
uploadNewBackgroundFx.use(handleUploadNewBackground);
deleteMediaMeetingFx.use(handleDeleteMediaMeeting);

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
    }))
    .reset(resetRoomStores);

$queryMediasBackgroundStore
    .on([setQueryMediasEvent], state => ({
        ...state,
        skip: state.skip + 1,
    }))
    .on(reloadMediasEvent, state => ({ ...state, skip: 0 }))
    .reset(setCategoryEvent, deleteMediaMeetingFx.doneData, resetRoomStores);

$isLoadMoreMediasStore
    .on(setQueryMediasEvent, () => true)
    .on(getBackgroundMeetingFx, () => false)
    .reset(resetRoomStores);

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
            data: dataUpdate?.thumb
                ? {
                      mediaLink: {
                          src: dataUpdate?.url,
                          thumb: dataUpdate?.thumb,
                          platform: 'youtube',
                      },
                  }
                : {
                      previewUrls: dataUpdate?.previewUrls.map(item => item.id),
                      url: dataUpdate?.url,
                      templateType: backgroundMeetingStore.medias.find(
                          item => item.id === clock.mediaSelected,
                      )?.type,
                      mediaLink: null,
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
    clock: [
        setQueryMediasEvent,
        reloadMediasEvent,
        deleteMediaMeetingFx.doneData,
    ],
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

sample({
    clock: deleteMediaMeetingFx.doneData,
    fn: (_, clock: ResultDeleteMedia) => ({
        type: NotificationType.DeleteMedia,
        message: clock.message,
        withSuccessIcon: clock.success,
        withErrorIcon: !clock.success,
    }),
    target: addNotificationEvent,
});
