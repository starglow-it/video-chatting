import { createSocketEvent } from '../socket/model';
import { DashboardSocketEmitters } from '../../const/socketEvents/emitters';
import { JoinDashboardPayload, MeetingAvailablePayload } from '../socket/types';

export const joinDashboardSocketEvent = createSocketEvent<JoinDashboardPayload, void>(
    DashboardSocketEmitters.JoinDashboard,
);

export const meetingAvailableSocketEvent = createSocketEvent<MeetingAvailablePayload, void>(
    DashboardSocketEmitters.MeetingAvailable,
);
