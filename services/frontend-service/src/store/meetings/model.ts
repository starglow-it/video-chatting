import {
    CreateMeetingPayload,
    DeleteMeetingPayload,
    ErrorState,
    IUserTemplate,
} from 'shared-types';
import { MeetingStore } from '../types';
import { CreateMeetingResponse } from './types';
import { meetingsDomain } from '../domains';

export const $meetingsStore = meetingsDomain.createStore<MeetingStore>({});

export const createMeetingFx = meetingsDomain.createEffect<
    CreateMeetingPayload,
    CreateMeetingResponse
>('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.createEffect<
    DeleteMeetingPayload,
    void
>('deleteMeetingFx');

export const checkCustomLinkFx = meetingsDomain.createEffect<
    {
        templateId: IUserTemplate['id'];
        customLink: IUserTemplate['customLink'];
    },
    boolean,
    ErrorState
>('checkCustomLinkFx');
