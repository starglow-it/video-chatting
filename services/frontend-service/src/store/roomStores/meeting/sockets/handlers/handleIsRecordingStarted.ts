
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleIsRecordingStarted = () => {
    addNotificationEvent({
        type: NotificationType.IsRecordingStarted,
        message: "isRecordingStartedNotification",
    });
};
