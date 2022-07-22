import { root } from '../root';
import { MeetingStore, Template, UserTemplate } from '../types';

export const meetingsDomain = root.createDomain('meetingsDomain');

export const $meetingsStore = meetingsDomain.store<MeetingStore>({});

export const createMeetingFx = meetingsDomain.effect<
    { templateId: Template['id'] },
    { template?: UserTemplate }
>('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.effect<{ templateId: Template['id'] }, void>(
    'deleteMeetingFx',
);
