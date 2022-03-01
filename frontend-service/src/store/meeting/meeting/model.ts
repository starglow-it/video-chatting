import { JoinMeetingResult, Meeting } from '../../types';
import { meetingDomain } from '../domain';

const initialMeetingState: Meeting = {
    id: '',
    isMonetizationEnabled: false,
    mode: 'together',
    owner: '',
    users: [],
    ownerProfileId: '',
};

export const $meetingStore = meetingDomain.store<Meeting>(initialMeetingState);

export const setMeetingEvent = meetingDomain.event<JoinMeetingResult>('setMeetingEvent');
export const updateMeetingEvent = meetingDomain.event<{ meeting?: Meeting }>('updateMeetingEvent');
export const resetMeetingStore = meetingDomain.event('resetMeetingStore');
