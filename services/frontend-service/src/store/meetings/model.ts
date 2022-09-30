import { MeetingStore } from '../types';
import { CreateMeetingPayload, CreateMeetingResponse, DeleteMeetingPayload } from './types';
import { meetingsDomain } from '../domains';

export const $meetingsStore = meetingsDomain.createStore<MeetingStore>({});

export const createMeetingFx = meetingsDomain.createEffect<
    CreateMeetingPayload,
    CreateMeetingResponse
>('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.createEffect<DeleteMeetingPayload, void>(
    'deleteMeetingFx',
);
