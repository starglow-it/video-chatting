import { MeetingQuestionAnswer } from 'src/store/types';

export const convertQuestions = (data: MeetingQuestionAnswer[]) => {
    const tmp: any[] = [];
    // tmp.push({ id: Date.now(), timestamp: Date.now(), type: 'time' });
    data.forEach(item => {
        const lastItem = tmp.at(-1);
        if (lastItem?.id === item.id) {
            tmp.push({ ...item, type: 'recently' });
        } else {
            tmp.push({ ...item, type: 'text' });
        }
    });
    return tmp;
};
