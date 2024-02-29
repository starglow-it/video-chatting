import { setRecordingUrlEvent, stopRecordMeetingByOthers, isRequestRecordingEndEvent, resetMeetingRecordingStoreExceptVideosEvent } from '../../../../../store/roomStores';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetMeetingUrlReceive = ({ user, url }: { user: string, url: string }) => {
    isRequestRecordingEndEvent();
    stopRecordMeetingByOthers();
    resetMeetingRecordingStoreExceptVideosEvent();
    setRecordingUrlEvent(url);
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: `${user} stopped recording`,
        withSuccessIcon: true
    });
};
