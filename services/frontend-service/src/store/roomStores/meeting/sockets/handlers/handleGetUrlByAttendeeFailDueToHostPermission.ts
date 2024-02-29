import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleGetUrlByAttendeeFailDueToHostPermission = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.getUrlByAttendeeFailDueToHostPermission",
        withErrorIcon: true
    });
};
