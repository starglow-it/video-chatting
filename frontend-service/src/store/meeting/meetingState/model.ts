import {meetingDomain} from "../domain";

export const $isEditTemplateOpenStore = meetingDomain.store<boolean>(false);
export const $isMeetingInfoOpenStore = meetingDomain.store<boolean>(false);

export const toggleEditTemplateOpen = meetingDomain.event('toggleEditTemplateOpen');
export const toggleMeetingInfoOpen = meetingDomain.event('toggleMeetingInfoOpen');
export const setEditTemplateOpenEvent = meetingDomain.event<boolean>('setEditTemplateOpenEvent');
export const setMeetingInfoOpenEvent = meetingDomain.event<boolean>('setMeetingInfoOpenEvent');