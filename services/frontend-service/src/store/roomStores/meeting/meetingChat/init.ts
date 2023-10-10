import { convertMessageItem } from 'src/utils/functions/convertMessageItem';
import { resetRoomStores } from 'src/store/root';
import { $isThereNewMessage, $meetingChat, addMessageToChatEvent } from './model';

$meetingChat.on(addMessageToChatEvent, (state, message) => ({
    ...state,
    list: [...state.list, ...convertMessageItem(message, state.list)],
})).reset(resetRoomStores);


$isThereNewMessage.on(addMessageToChatEvent, () => Date.now()).reset(resetRoomStores)