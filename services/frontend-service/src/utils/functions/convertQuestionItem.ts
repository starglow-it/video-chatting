import { MeetingQuestionAnswer } from 'src/store/types';

export const convertQuestionItem = (item: MeetingQuestionAnswer, questions: any[]) => {
    const tmp: any[] = [];
    // if (!questions.length)
    //     tmp.push({
    //         id: Date.now(),
    //         body: new Date().toLocaleTimeString(),
    //         type: 'time',
    //     });
    if (questions?.at(-1)?.sender?.id === item?.sender?.id) {
        tmp.push({ ...item, type: 'recently' });
    } else {
        tmp.push({ ...item, type: 'text' });
    }

    return tmp;
};
