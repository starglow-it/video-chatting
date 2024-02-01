import { MeetingQuestionAnswer } from 'src/store/types';
import { addQuestionToQuestionAnswerEvent } from '../../meetingQuestionAnswer/model';
export const handleReceiveQuestion = ({ question }: { question: MeetingQuestionAnswer }) => {
    addQuestionToQuestionAnswerEvent(question);
};
