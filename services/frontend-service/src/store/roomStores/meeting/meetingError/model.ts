import { meetingDomain } from '../../../domains';

export const $meetingErrorStore = meetingDomain.createStore<string>('');

export const setMeetingErrorEvent = meetingDomain.createEvent<string>('setMeetingErrorEvent');
