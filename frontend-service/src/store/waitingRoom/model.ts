import {root} from "../root";
import {SocketState} from "../types";
import {createSocketEvent} from "../socket";
import {
    EMIT_BEFORE_MEETING_EVENT,
    EMIT_ENTER_WAITING_ROOM_EVENT,
    EMIT_JOIN_DASHBOARD_EVENT,
    EMIT_MEETING_AVAILABLE_EVENT
} from "./const/emitSocketEvents";

const waitingRoomDomain = root.createDomain('waitingRoomDomain');

export const emitJoinDashboard = waitingRoomDomain.event('emitJoinDashboard');
export const emitSendEnterWaitingRoom = waitingRoomDomain.event('emitSendEnterWaitingRoom');
export const subscribeToSocketEvents = waitingRoomDomain.event<SocketState>('emitJoinDashboard');

export const joinRoomBeforeMeeting = createSocketEvent(EMIT_BEFORE_MEETING_EVENT);
export const joinDashboard = createSocketEvent(EMIT_JOIN_DASHBOARD_EVENT);
export const sendEnterWaitingRoom = createSocketEvent(EMIT_ENTER_WAITING_ROOM_EVENT);
export const sendMeetingAvailable = createSocketEvent(EMIT_MEETING_AVAILABLE_EVENT);