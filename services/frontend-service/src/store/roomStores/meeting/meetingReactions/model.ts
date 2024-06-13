import { meetingDomain } from '../../../domains';
import { MeetingReaction } from '../../../types';
import { MeetingSocketEmitters } from '../../../../const/socketEvents/emitters';
import { createMeetingSocketEvent } from '../../meetingSocket/model';

export type MeetingPanelsVisibilityForMobile = {
    isMobileMoreListVisible: boolean;
    isMobileChatPanelVisible: boolean;
    isMobileAttendeeListVisible: boolean;
    isMobileLinksPanleVisible: boolean;
    isMobileQAPanleVisible: boolean;
    isMobileStickyNotesVisible: boolean;
    isMobileSettingPanelVisible: boolean;
    isMobileDonationPanleVisible: boolean;
};

export const initialMeetingPanelsVisibilityData = {
    isMobileMoreListVisible: false,
    isMobileChatPanelVisible: false,
    isMobileAttendeeListVisible: false,
    isMobileLinksPanleVisible: false,
    isMobileQAPanleVisible: false,
    isMobileStickyNotesVisible: false,
    isMobileSettingPanelVisible: false,
    isMobileDonationPanleVisible: false
};

const initialMeetingReactionsState: MeetingReaction[] = [];

export const $meetingReactionsStore = meetingDomain.createStore<MeetingReaction[]>(
    initialMeetingReactionsState,
);

export const $meetingEmojiListVisibilityStore = meetingDomain.createStore<{ isEmojiListVisible: boolean }>({ isEmojiListVisible: false });
export const $meetingDonationPanelForParticipantVisibilityStore = meetingDomain.createStore<{ isDonationPanelForParticipantVisible: boolean }>({ isDonationPanelForParticipantVisible: false });
export const $meetingDonationPanelForAudienceVisibilityStore = meetingDomain.createStore<{ isDonationPanelForAudienceVisible: boolean }>({ isDonationPanelForAudienceVisible: false });

//For mobile panels
export const $meetingPanelsVisibilityForMobileStore = meetingDomain.createStore<MeetingPanelsVisibilityForMobile>(initialMeetingPanelsVisibilityData);

export const setEmojiListVisibilityEvent = meetingDomain.createEvent<{ isEmojiListVisible: boolean }>('setEmojiListVisibilityEvent');
export const setDonationPanelForParticipantVisibilityEvent = meetingDomain.createEvent<{ isDonationPanelForParticipantVisible: boolean }>('setDonationPanelForParticipantVisibilityEvent');
export const setDonationPanelForAudienceVisibilityEvent = meetingDomain.createEvent<{ isDonationPanelForAudienceVisible: boolean }>('setDonationPanelForAudienceVisibilityEvent');
export const setMeetingPanelsVisibilityForMobileEvent = meetingDomain.createEvent<MeetingPanelsVisibilityForMobile>('setMeetingPanelsVisibilityForMobileEvent');
export const addMeetingReactionsEvent = meetingDomain.createEvent<MeetingReaction>(
    'addMeetingReactionsEvent',
);
export const setMeetingReactionsEvent = meetingDomain.createEvent<MeetingReaction[]>(
    'setMeetingReactionsEvent',
);
export const removeMeetingReactionEvent = meetingDomain.createEvent<
    MeetingReaction['id']
>('removeMeetingReactionEvent');
export const sendMeetingReactionSocketEvent = createMeetingSocketEvent<
    { emojiName: string },
    void
>(MeetingSocketEmitters.SendMeetingReaction);
export const removeMeetingReactionSocketEvent = createMeetingSocketEvent<
    { reactionId: MeetingReaction['id'] },
    void
>(MeetingSocketEmitters.RemoveMeetingReaction);
export const getMeetingReactionsSocketEvent = createMeetingSocketEvent<
    void,
    { meetingReactions: MeetingReaction[] }
>(MeetingSocketEmitters.GetMeetingReaction);
export const resetMeetingReactionsStore = meetingDomain.createEvent('resetMeetingReactionsStore')
