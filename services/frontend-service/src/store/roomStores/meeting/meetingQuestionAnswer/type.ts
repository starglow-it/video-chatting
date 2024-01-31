import { QuestionAnswerItem } from '@components/Meeting/MeetingQuestionAnswer/type';

export type MeetingQuestionAnswerStore = {
    list: QuestionAnswerItem[];
    skip: number;
    limit: number;
};
