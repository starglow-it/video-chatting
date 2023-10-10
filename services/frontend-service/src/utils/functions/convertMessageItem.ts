import { MeetingChat } from 'src/store/types';

export const convertMessageItem = (item: MeetingChat, messages: any[]) => {
    const tmp: any[] = [];
    if (!messages.length)
        tmp.push({
            id: Date.now(),
            body: new Date().toLocaleTimeString(),
            type: 'time',
        });
    if (messages?.at(-1)?.sender?.id === item?.sender?.id) {
        tmp.push({ ...item, type: 'recently' });
    } else {
        tmp.push({ ...item, type: 'text' });
    }

    return tmp;
};
