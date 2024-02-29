import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { resetMeetingRecordingStore } from 'src/store/root';

export const handleReceiveRequestRecordingRejected = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.recordingRequestReject",
        withErrorIcon: true
    });
    resetMeetingRecordingStore();
};
