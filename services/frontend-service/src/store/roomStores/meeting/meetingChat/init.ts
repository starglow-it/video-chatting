import { convertMessageItem } from 'src/utils/functions/convertMessageItem';
import { resetRoomStores } from 'src/store/root';
import { combine, sample } from 'effector';
import {
    $isHaveNewMessage,
    $isThereNewMessage,
    $meetingChat,
    addMessageToChatEvent,
    reactionMessageEvent,
    resetHaveNewMessageEvent,
    setCountNewMessageEvent,
} from './model';
import { $localUserStore } from '../../users/localUser/model';
import { $activeTabPanel } from '../meeting/model';
import {
    $isToggleUsersPanel,
    toggleUsersPanelEvent,
} from '../../users/meetingUsers/model';
import { $isAudience } from '../meetingRole/model';

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

$isHaveNewMessage
    .on(setCountNewMessageEvent, (_, number) => number)
    .reset(resetHaveNewMessageEvent);

sample({
    clock: addMessageToChatEvent,
    source: combine({
        localUser: $localUserStore,
        activeTab: $activeTabPanel,
        isOpenPanel: $isToggleUsersPanel,
        isAudience: $isAudience,
    }),
    filter: ({ localUser, activeTab, isOpenPanel, isAudience }, message) =>
        localUser.id !== message?.sender?.id &&
        ((activeTab !== 2 && !isAudience) || !isOpenPanel),
    fn: () => Date.now(),
    target: setCountNewMessageEvent,
});

sample({
    clock: toggleUsersPanelEvent,
    source: combine({
        activeTab: $activeTabPanel,
        isOpenPanel: $isToggleUsersPanel,
        isAudience: $isAudience,
    }),
    filter: ({ activeTab, isOpenPanel, isAudience }) =>
        (isOpenPanel && activeTab === 2) || isOpenPanel || isAudience,
    fn: () => 0,
    target: setCountNewMessageEvent,
});
