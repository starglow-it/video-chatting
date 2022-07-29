import { createSocketEvent } from '../socket/model';
import {
    EMIT_BEFORE_MEETING_EVENT,
    EMIT_ENTER_WAITING_ROOM_EVENT,
    EMIT_JOIN_DASHBOARD_EVENT,
    EMIT_MEETING_AVAILABLE_EVENT,
} from '../../const/socketEvents/emitters';

export const joinRoomBeforeMeetingSocketEvent = createSocketEvent(EMIT_BEFORE_MEETING_EVENT);
export const joinDashboardSocketEvent = createSocketEvent(EMIT_JOIN_DASHBOARD_EVENT);
export const sendEnterWaitingRoomSocketEvent = createSocketEvent(EMIT_ENTER_WAITING_ROOM_EVENT);
export const sendMeetingAvailableSocketEvent = createSocketEvent(EMIT_MEETING_AVAILABLE_EVENT);
