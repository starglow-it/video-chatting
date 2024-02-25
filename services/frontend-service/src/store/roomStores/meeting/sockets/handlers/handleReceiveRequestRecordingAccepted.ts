import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { recordingRequestAcceptedEvent } from '../../../../../store/roomStores';

export const handleReceiveRequestRecordingAccepted = () => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.recordingRequestAcccept",
        withSuccessIcon: true
    });
    recordingRequestAcceptedEvent();
};
