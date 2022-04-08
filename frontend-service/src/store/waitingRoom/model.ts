import {root} from "../root";
import {SocketState} from "../types";
import {createSocketEvent} from "../socket";

const waitingRoomDomain = root.createDomain('waitingRoomDomain');

export const emitJoinDashboard = waitingRoomDomain.event('emitJoinDashboard');
export const emitSendEnterWaitingRoom = waitingRoomDomain.event('emitSendEnterWaitingRoom');
export const subscribeToSocketEvents = waitingRoomDomain.event<SocketState>('emitJoinDashboard');

export const joinRoomBeforeMeeting = createSocketEvent('dashboard:before-meeting');
export const joinDashboard = createSocketEvent('dashboard:join');
export const sendEnterWaitingRoom = createSocketEvent('dashboard:sendEnterWaitingRoom');
export const sendMeetingAvailable = createSocketEvent('waitingRoom:meetingAvailable');