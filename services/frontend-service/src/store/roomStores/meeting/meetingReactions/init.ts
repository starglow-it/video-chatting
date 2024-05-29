import {
    $meetingReactionsStore,
    $meetingEmojiListVisibilityStore,
    $meetingPanelsVisibilityForMobileStore,
    setEmojiListVisibilityEvent,
    getMeetingReactionsSocketEvent,
    setMeetingReactionsEvent,
    addMeetingReactionsEvent,
    removeMeetingReactionEvent,
    setMeetingPanelsVisibilityForMobileEvent
} from './model';
import { resetRoomStores } from '../../../root';
import { MeetingPanelsVisibilityForMobile } from './model';

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

$meetingEmojiListVisibilityStore.on(setEmojiListVisibilityEvent, (state, data) => data);
$meetingPanelsVisibilityForMobileStore.on(setMeetingPanelsVisibilityForMobileEvent, (
    _: MeetingPanelsVisibilityForMobile, data: MeetingPanelsVisibilityForMobile
) => data);
