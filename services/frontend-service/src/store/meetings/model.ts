import { MeetingStore } from '../types';
import { CreateMeetingResponse } from './types';
import { meetingsDomain } from '../domains';

import { CreateMeetingPayload, DeleteMeetingPayload } from 'shared-types';

export const $meetingsStore = meetingsDomain.createStore<MeetingStore>({});

export const createMeetingFx = meetingsDomain.createEffect<
    CreateMeetingPayload,
    CreateMeetingResponse
>('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.createEffect<DeleteMeetingPayload, void>(
    'deleteMeetingFx',
);
