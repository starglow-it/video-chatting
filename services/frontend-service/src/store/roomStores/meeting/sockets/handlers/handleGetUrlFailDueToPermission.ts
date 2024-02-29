import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetUrlFailDueToPermission = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.getUrlFailDueToPermission",
        withErrorIcon: true
    });
};
