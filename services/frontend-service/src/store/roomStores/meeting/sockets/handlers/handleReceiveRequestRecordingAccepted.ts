import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { recordingRequestAcceptedEvent, isRequestRecordingStartEvent } from '../../../../../store/roomStores';

export const handleReceiveRequestRecordingAccepted = ({ username }: { username: string }) => {
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: `${username} started recording`,
        withSuccessIcon: true
    });
    isRequestRecordingStartEvent();
    recordingRequestAcceptedEvent();
};
