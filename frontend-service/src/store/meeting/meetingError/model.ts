import { meetingDomain } from '../domain';

export const $meetingErrorStore = meetingDomain.store<string>('');

export const setMeetingErrorEvent = meetingDomain.event<string>('setMeetingErrorEvent');
