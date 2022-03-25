import { meetingDomain } from '../domain';
import { MeetingInstance } from '../../types';

export const initialMeetingInstanceState: MeetingInstance = {
    id: '',
    serverIp: '',
    owner: '',
    template: '',
};

// store
export const $meetingInstanceStore = meetingDomain.store<MeetingInstance>(
    initialMeetingInstanceState,
);

// events
export const resetMeetingInstanceStore = meetingDomain.event('resetMeetingInstanceStore');

// effects
export const fetchMeetingInstanceFx = meetingDomain.effect<
    { templateId: MeetingInstance['template'] },
    { meeting: MeetingInstance },
    any
>('fetchMeetingInstanceFx');
