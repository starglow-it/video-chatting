import { createSocketEvent } from '../socket/model';
import { DashboardSocketEmitters } from '../../const/socketEvents/emitters';
import {
    JoinDashboardPayload,
    JoinRoomBeforeMeetingPayload,
    MeetingAvailablePayload,
    StartWaitForServerPayload,
} from '../socket/types';

export const joinRoomBeforeMeetingSocketEvent = createSocketEvent<
    JoinRoomBeforeMeetingPayload,
    void
>(DashboardSocketEmitters.JoinRoomBeforeMeeting);

export const startWaitForServerSocketEvent = createSocketEvent<StartWaitForServerPayload, void>(
    DashboardSocketEmitters.CreateMeeting,
);

export const joinDashboardSocketEvent = createSocketEvent<JoinDashboardPayload, void>(
    DashboardSocketEmitters.JoinDashboard,
);

export const meetingAvailableSocketEvent = createSocketEvent<MeetingAvailablePayload, void>(
    DashboardSocketEmitters.MeetingAvailable,
);
