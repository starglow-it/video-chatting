type ChatType = 'time' | 'text' | 'recently';

export type ChatItem = {
    type?: ChatType;
    isLocal?: boolean;
};
