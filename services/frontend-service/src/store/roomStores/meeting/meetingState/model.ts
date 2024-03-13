import { meetingDomain } from '../../../domains';

export const $isEditTemplateOpenStore =
    meetingDomain.createStore<boolean>(true);
export const $isMeetingInfoOpenStore =
    meetingDomain.createStore<boolean>(false);

export const toggleEditTemplateOpen = meetingDomain.createEvent(
    'toggleEditTemplateOpen',
);
export const toggleMeetingInfoOpen = meetingDomain.createEvent(
    'toggleMeetingInfoOpen',
);
export const setEditTemplateOpenEvent = meetingDomain.createEvent<boolean>(
    'setEditTemplateOpenEvent',
);
export const setMeetingInfoOpenEvent = meetingDomain.createEvent<boolean>(
    'setMeetingInfoOpenEvent',
);
