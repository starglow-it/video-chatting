import { reactionQuestionAnswerEvent } from '../../meetingQuestionAnswer/model';
import { SendUnReactionQuestionResponse } from '../types';

export const handleReceiveQuestionUnReaction = ({
    question,
}: SendUnReactionQuestionResponse) => {
    reactionQuestionAnswerEvent({ question });
};
