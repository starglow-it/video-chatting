import { VideoChatSocketSubscribers } from '../../../../../const/socketEvents/subscribers';

// utils
import { emptyFunction } from '../../../../../utils/functions/emptyFunction';

// handlers
import { handleGetOffer } from './handleGetOffer';
import { handleGetAnswer } from './handleGetAnswer';
import { handleGetIceCandidate } from './handleGetIceCandidate';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type MeetingSocketHandlerDataMap = Map<VideoChatSocketSubscribers, SocketHandlerData>;

const VIDEOCHAT_SUBSCRIBE_HANDLERS_REGISTRY: MeetingSocketHandlerDataMap = new Map([
    [VideoChatSocketSubscribers.OnGetOffer, { handler: handleGetOffer }],
    [VideoChatSocketSubscribers.OnGetAnswer, { handler: handleGetAnswer }],
    [VideoChatSocketSubscribers.OnGetIceCandidate, { handler: handleGetIceCandidate }],
]);

export const getVideoChatSocketSubscribeHandler = (
    eventName: VideoChatSocketSubscribers,
): SocketHandlerData['handler'] =>
    VIDEOCHAT_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;
