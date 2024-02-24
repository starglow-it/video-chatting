import { addNotificationEvent } from 'src/store/notifications/model';
import { receiveRequestRecordingEvent } from '../../meeting/model';
import { RecodingAnswerResponse } from '../types';
import { NotificationType } from 'src/store/types';

export const handleReceiveRequestRecordingRejected = ({
    isRecordingStart
}: RecodingAnswerResponse) => {
    
    console.log(isRecordingStart);
};
