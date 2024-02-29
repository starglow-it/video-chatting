import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetUrlFailDueToHostPermission = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.getUrlFailDueToHostPermission",
        withErrorIcon: true
    });
};
