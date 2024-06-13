import {
    $meetingReactionsStore,
    $meetingEmojiListVisibilityStore,
    $meetingPanelsVisibilityForMobileStore,
    $meetingDonationPanelForParticipantVisibilityStore,
    $meetingDonationPanelForAudienceVisibilityStore,
    setEmojiListVisibilityEvent,
    getMeetingReactionsSocketEvent,
    setMeetingReactionsEvent,
    addMeetingReactionsEvent,
    removeMeetingReactionEvent,
    setMeetingPanelsVisibilityForMobileEvent,
    resetMeetingReactionsStore,
    setDonationPanelForParticipantVisibilityEvent,
    setDonationPanelForAudienceVisibilityEvent
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
    .reset(resetMeetingReactionsStore)
    .reset(resetRoomStores);

$meetingEmojiListVisibilityStore.on(setEmojiListVisibilityEvent, (state, data) => data);
$meetingDonationPanelForParticipantVisibilityStore.on(setDonationPanelForParticipantVisibilityEvent, (state, data) => data);
$meetingDonationPanelForAudienceVisibilityStore.on(setDonationPanelForAudienceVisibilityEvent, (state, data) => data);
$meetingPanelsVisibilityForMobileStore.on(setMeetingPanelsVisibilityForMobileEvent, (
    _: MeetingPanelsVisibilityForMobile, data: MeetingPanelsVisibilityForMobile
) => data);

