import { addOrangeNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetMeetingUrlReceive = () => {
    addOrangeNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: 'recording.saveSuccess',
        withSuccessIcon: true
    });
};
