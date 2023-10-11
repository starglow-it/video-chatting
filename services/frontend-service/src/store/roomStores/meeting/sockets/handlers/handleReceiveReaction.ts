import { reactionMessageEvent } from '../../meetingChat/model';
import { SendReactionMessageReponse } from '../types';

export const handleReceiveReaction = (data: SendReactionMessageReponse) => {
    reactionMessageEvent({ message: data.message });
};
