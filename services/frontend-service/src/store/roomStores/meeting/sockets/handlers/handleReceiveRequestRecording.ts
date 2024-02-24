import { addNotificationEvent } from 'src/store/notifications/model';
import { receiveRequestRecordingEvent } from '../../meeting/model';
import { RequestRecordingResponse } from '../types';
import { NotificationType } from 'src/store/types';

export const handleReceiveRequestRecording = ({
    username
}: RequestRecordingResponse) => {
    receiveRequestRecordingEvent(username);
    // addNotificationEvent({
    //     type: NotificationType.RequestRecordingMeeting,
    //     // message: `meeting.deviceErrors.${audioError?.type}`,
    //     message: `${message}`,
    // });
    console.log(username);
};
