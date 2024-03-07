import { stopRecordMeetingByOthers, isRequestRecordingEndEvent, resetMeetingRecordingStoreExceptVideosEvent } from '../../../../../store/roomStores';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetMeetingUrlsReceiveFail = () => {
    isRequestRecordingEndEvent();
    stopRecordMeetingByOthers();
    resetMeetingRecordingStoreExceptVideosEvent();

    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.stopRecordingFail",
        withErrorIcon: true
    });
};
