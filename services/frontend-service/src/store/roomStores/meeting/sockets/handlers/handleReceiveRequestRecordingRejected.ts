import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

export const handleReceiveRequestRecordingRejected = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.recordingRequestReject",
        withErrorIcon: true
    });
};
