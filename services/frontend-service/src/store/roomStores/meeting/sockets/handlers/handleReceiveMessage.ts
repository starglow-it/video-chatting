import { MeetingChat } from 'src/store/types';
import { addMessageToChatEvent } from '../../meetingChat/model';

export const handleReceiveMessage = ({ message }: { message: MeetingChat }) => {
    addMessageToChatEvent(message);
};
