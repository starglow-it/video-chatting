import { meetingDomain } from 'src/store/domains';
import { MeetingQuestionAnswer } from 'src/store/types';
import { MeetingQuestionAnswerStore } from './type';

export const $meetingQuestionAnswer = meetingDomain.createStore<MeetingQuestionAnswerStore>({
    list: [],
    skip: 0,
    limit: 15,
});

export const $isThereNewQuestion = meetingDomain.createStore<number>(0);

export const $isHaveNewQuestion = meetingDomain.createStore<number>(0);

export const addQuestionToQuestionAnswerEvent = meetingDomain.createEvent<any>(
    'addQuestionToQuesionAnswerEvent',
);

export const reactionQuestionAnswerEvent = meetingDomain.createEvent<{
    question: MeetingQuestionAnswer;
}>('reactionQuestionEvent');

export const resetHaveNewQuestionEvent = meetingDomain.createEvent(
    'resetHaveNewQuestionEvent',
);

export const setCountNewQuestionEvent = meetingDomain.createEvent<number>(
    'setCountNewQuestionEvent',
);
