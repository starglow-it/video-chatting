import { reactionQuestionAnswerEvent } from '../../meetingQuestionAnswer/model';
import { SendReactionQuestionReponse } from '../types';

export const handleReceiveQuestionReaction = ({
    reaction,
}: SendReactionQuestionReponse) => {
    reactionQuestionAnswerEvent({ question: reaction.meetingQuestionAnswer });
};
