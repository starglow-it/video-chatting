import { setRecordingUrlsEvent, stopRecordMeetingByOthers, isRequestRecordingEndEvent } from '../../../../../store/roomStores';
import { resetMeetingRecordingStore } from 'src/store/root';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetMeetingUrlsReceive = ({ user, urls }: { user: string, urls: string[] }) => {
    isRequestRecordingEndEvent();
    stopRecordMeetingByOthers();
    resetMeetingRecordingStore();
    setRecordingUrlsEvent(urls);
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: `${user} stopped recording`,
        withSuccessIcon: true
    });
};
