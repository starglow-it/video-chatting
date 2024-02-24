import { addNotificationEvent } from 'src/store/notifications/model';
import { receiveRequestRecordingEvent } from '../../meeting/model';
import { RequestRecordingResponse } from '../types';
import { NotificationType } from 'src/store/types';

export const handleReceiveRequestRecording = ({
    message,
}: RequestRecordingResponse) => {
    receiveRequestRecordingEvent({ message });
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        // message: `meeting.deviceErrors.${audioError?.type}`,
        message: `${message}`,
    });
};
