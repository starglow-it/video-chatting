import { createSocketEvent } from '../socket/model';
import {
    EMIT_ENTER_WAITING_ROOM,
    EMIT_JOIN_DASHBOARD,
    EMIT_MEETING_AVAILABLE,
    EMIT_JOIN_ROOM_BEFORE_MEETING,
} from '../../const/socketEvents/emitters';
import {
    EnterWaitingRoomPayload,
    JoinDashboardPayload,
    JoinRoomBeforeMeetingPayload,
    MeetingAvailablePayload,
} from '../socket/types';

export const joinRoomBeforeMeetingSocketEvent = createSocketEvent<
    JoinRoomBeforeMeetingPayload,
    void
>(EMIT_JOIN_ROOM_BEFORE_MEETING);

export const joinDashboardSocketEvent = createSocketEvent<JoinDashboardPayload, void>(
    EMIT_JOIN_DASHBOARD,
);

export const enterWaitingRoomSocketEvent = createSocketEvent<EnterWaitingRoomPayload, void>(
    EMIT_ENTER_WAITING_ROOM,
);

export const meetingAvailableSocketEvent = createSocketEvent<MeetingAvailablePayload, void>(
    EMIT_MEETING_AVAILABLE,
);
