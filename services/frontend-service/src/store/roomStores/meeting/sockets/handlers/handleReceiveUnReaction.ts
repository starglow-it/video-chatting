import { reactionMessageEvent } from '../../meetingChat/model';
import { SendUnReactionMessageResponse } from '../types';

export const handleReceiveUnReaction = ({
    message,
}: SendUnReactionMessageResponse) => {
    reactionMessageEvent({ message });
};
