import {createMainSocketEvent} from "../mainServerSocket";
import {root} from "../root";
import {SocketState} from "../types";

const waitingRoomDomain = root.createDomain('waitingRoomDomain');

export const emitJoinDashboard = waitingRoomDomain.event('emitJoinDashboard');
export const emitSendEnterWaitingRoom = waitingRoomDomain.event('emitSendEnterWaitingRoom');
export const subscribeToSocketEvents = waitingRoomDomain.event<SocketState>('emitJoinDashboard');

export const joinRoomBeforeMeeting = createMainSocketEvent('dashboard:before-meeting');
export const joinDashboard = createMainSocketEvent('dashboard:join');
export const sendEnterWaitingRoom = createMainSocketEvent('dashboard:sendEnterWaitingRoom');
export const sendMeetingAvailable = createMainSocketEvent('waitingRoom:meetingAvailable');