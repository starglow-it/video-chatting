import {
    $meetingReactionsStore,
    $meetingEmojiListVisibilityStore,
    setEmojiListVisibilityEvent,
    getMeetingReactionSocketEvent,
    addMeetingReactionsEvent,
    removeMeetingReactionEvent,
} from './model';
import { resetRoomStores } from '../../../root';

$meetingReactionsStore
    .on(addMeetingReactionsEvent, (state, data) => [...state, data])
    .on(getMeetingReactionSocketEvent.doneData, (state, { meetingReaction }) => [
        ...state,
        meetingReaction,
    ])
    .on(removeMeetingReactionEvent, (state, data) =>
        state.filter(reaction => reaction.id !== data),
    )
    .reset(resetRoomStores);

$meetingEmojiListVisibilityStore.on(setEmojiListVisibilityEvent, (state, { isEmojiListVisible }) => ({
    ...state,
    isEmojiListVisible: isEmojiListVisible
}));
