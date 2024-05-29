import { MeetingReactionKind } from 'shared-types';
import { MeetingQuestionAnswer } from 'src/store/types';

export type QuestionAnswerType = 'time' | 'text' | 'recently';

export type QuestionAnswerItem = {
    type?: QuestionAnswerType;
    isBreak?: boolean;
    onReaction?: (questionId: string, kind: MeetingReactionKind) => void;
    onUnReaction?: (questionId: string, kind: MeetingReactionKind) => void;
} & MeetingQuestionAnswer;
