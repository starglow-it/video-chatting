import { receiveRequestRecordingEvent } from '../../meeting/model';
import { RequestRecordingResponse } from '../types';

export const handleReceiveRequestRecording = ({
    userId,
    username
}: RequestRecordingResponse) => {
    receiveRequestRecordingEvent({userId, username});
};
