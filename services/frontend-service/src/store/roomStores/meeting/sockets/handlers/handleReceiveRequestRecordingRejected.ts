import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { resetMeetingRecordingStoreExceptVideosEvent } from '../../../../../store/roomStores';

export const handleReceiveRequestRecordingRejected = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.recordingRequestReject",
        withErrorIcon: true
    });
    resetMeetingRecordingStoreExceptVideosEvent();
};
