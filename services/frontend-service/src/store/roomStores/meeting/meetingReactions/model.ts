import { meetingDomain } from '../../../domains';
import { MeetingReaction } from '../../../types';
import { MeetingSocketEmitters } from '../../../../const/socketEvents/emitters';
import { createMeetingSocketEvent } from '../../meetingSocket/model';

const initialMeetingReactionsState: MeetingReaction[] = [];

export const $meetingReactionsStore = meetingDomain.createStore<MeetingReaction[]>(
    initialMeetingReactionsState,
);

export const $meetingEmojiListVisibilityStore = meetingDomain.createStore<{ isEmojiListVisible: boolean }>({ isEmojiListVisible: false });

export const setEmojiListVisibilityEvent = meetingDomain.createEvent<{ isEmojiListVisible: boolean }>('setEmojiListVisibilityEvent');

export const addMeetingReactionsEvent = meetingDomain.createEvent<MeetingReaction>(
    'addMeetingReactionsEvent',
);
export const removeMeetingReactionEvent = meetingDomain.createEvent<
    MeetingReaction['id']
>('removeMeetingReactionEvent');

export const sendMeetingReactionSocketEvent = createMeetingSocketEvent<
    { meetingReaction: MeetingReaction },
    void
>(MeetingSocketEmitters.SendMeetingReaction);
// export const removeMeetingReactionSocketEvent = createMeetingSocketEvent<
//     { ReactionId: MeetingReaction['id'] },
//     void
// >(MeetingSocketEmitters.RemoveMeetingReaction);
export const getMeetingReactionSocketEvent = createMeetingSocketEvent<
    void,
    { meetingReaction: MeetingReaction }
>(MeetingSocketEmitters.GetMeetingReaction);
