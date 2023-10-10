import { MeetingChat } from 'src/store/types';
import { addMessageToChatEvent } from '../../meetingChat/model';

export const handleRecieveMessage = ({ message }: { message: MeetingChat }) => {
    addMessageToChatEvent(message);
};
