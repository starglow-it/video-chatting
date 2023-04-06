import { combine, forward, sample } from 'effector';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import { sendUpdateMeetingTemplateSocketEvent } from '../sockets/init';
import { handleGetBackgroundMeeting } from './handlers/handleGetBackground';
import { handleUpdateBackgroundMeeting } from './handlers/handleUpdateBackgroundMeeting';
import {
    $backgroundMeetingStore,
    $isToggleChangeBackground,
    toggleChangeBackgroundEvent,
    setCategoryEvent,
    getBackgroundMeetingFx,
    setMediaEvent,
    updateBackgroundMeetingFx,
} from './model';

getBackgroundMeetingFx.use(handleGetBackgroundMeeting);
updateBackgroundMeetingFx.use(handleUpdateBackgroundMeeting);

$isToggleChangeBackground.on(toggleChangeBackgroundEvent, toggle => !toggle);

$backgroundMeetingStore
    .on([setCategoryEvent, setMediaEvent], (state, data) => ({
        ...state,
        ...data,
    }))
    .on(getBackgroundMeetingFx.doneData, (state, data) => ({
        ...state,
        medias: data,
    }));

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
    fn: ({ meetingTemplateStore, backgroundMeetingStore }, clock) => ({
        templateId: meetingTemplateStore.id,
        data: backgroundMeetingStore.medias.find(
            item => item.id === clock.mediaSelected,
        )?.previewUrls,
    }),
    target: updateBackgroundMeetingFx,
});

forward({
    from: updateBackgroundMeetingFx.doneData,
    to: sendUpdateMeetingTemplateSocketEvent
})