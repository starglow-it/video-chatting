import { reactionMessageEvent } from '../../meetingChat/model';
import { SendReactionMessageReponse } from '../types';

export const handleReceiveReaction = ({
    reaction,
}: SendReactionMessageReponse) => {
    reactionMessageEvent({ message: reaction.meetingChat });
};
