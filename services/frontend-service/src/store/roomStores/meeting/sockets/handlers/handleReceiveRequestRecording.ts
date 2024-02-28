import { receiveRequestRecordingEvent } from '../../meeting/model';
import { MeetingUser } from '../../../../../store/types';

export const handleReceiveRequestRecording = ({ user }: { user:MeetingUser }) => {
    receiveRequestRecordingEvent(user);
};
