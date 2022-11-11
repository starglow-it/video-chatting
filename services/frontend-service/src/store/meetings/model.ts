import {CreateMeetingPayload, DeleteMeetingPayload, ErrorState} from 'shared-types';
import {MeetingStore, UserTemplate} from '../types';
import { CreateMeetingResponse } from './types';
import { meetingsDomain} from '../domains';

export const $meetingsStore = meetingsDomain.createStore<MeetingStore>({});

export const createMeetingFx = meetingsDomain.createEffect<
    CreateMeetingPayload,
    CreateMeetingResponse
>('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.createEffect<DeleteMeetingPayload, void>(
    'deleteMeetingFx',
);

export const checkCustomLinkFx = meetingsDomain.createEffect<
    { templateId: UserTemplate['customLink'] },
    boolean,
    ErrorState
    >('checkCustomLinkFx');
