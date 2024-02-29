import { setRecordingUrlEvent, stopRecordMeetingByOthers, isRequestRecordingEndEvent, resetMeetingRecordingStoreExceptVideosEvent } from '../../../../../store/roomStores';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetMeetingUrlReceive = ({ user, video }: { user: string, video: { id: string, endTime: string } }) => {
    isRequestRecordingEndEvent();
    stopRecordMeetingByOthers();
    resetMeetingRecordingStoreExceptVideosEvent();
    setRecordingUrlEvent(video);
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: `${user} stopped recording`,
        withSuccessIcon: true
    });
};
