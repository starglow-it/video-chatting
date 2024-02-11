import {
    $meetingReactionsStore,
    $meetingEmojiListVisibilityStore,
    setEmojiListVisibilityEvent,
    getMeetingReactionsSocketEvent,
    setMeetingReactionsEvent,
    addMeetingReactionsEvent,
    removeMeetingReactionEvent,
} from './model';
import { resetRoomStores } from '../../../root';

$meetingReactionsStore
    .on(addMeetingReactionsEvent, (state, data) => [...state, data])
    .on(setMeetingReactionsEvent, (state, data) => [...state, ...(data || [])])
    .on(getMeetingReactionsSocketEvent.doneData, (state, { meetingReactions }) => [
        ...state,
        (meetingReactions || []),
        // meetingReactions
    ])
    .on(removeMeetingReactionEvent, (state, data) =>
        state.filter(reaction => reaction.id !== data),
    )
    .reset(resetRoomStores);

$meetingEmojiListVisibilityStore.on(setEmojiListVisibilityEvent, (state, { isEmojiListVisible }) => ({
    ...state,
    isEmojiListVisible: isEmojiListVisible
}));
