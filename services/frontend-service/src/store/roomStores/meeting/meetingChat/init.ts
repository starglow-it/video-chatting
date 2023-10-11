import { convertMessageItem } from 'src/utils/functions/convertMessageItem';
import { resetRoomStores } from 'src/store/root';
import {
    $isThereNewMessage,
    $meetingChat,
    addMessageToChatEvent,
    reactionMessageEvent,
} from './model';

$meetingChat
    .on(addMessageToChatEvent, (state, message) => ({
        ...state,
        list: [...state.list, ...convertMessageItem(message, state.list)],
    }))
    .on(reactionMessageEvent, (state, data) => {
        return {
            ...state,
            list: state.list.map(item => {
                if (item.id === data.message.id) {
                    return { ...item, ...data.message };
                }
                return item;
            }),
        };
    })
    .reset(resetRoomStores);

$isThereNewMessage
    .on(addMessageToChatEvent, () => Date.now())
    .reset(resetRoomStores);
