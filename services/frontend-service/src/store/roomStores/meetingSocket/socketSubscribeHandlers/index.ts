// subscribe events
import { UsersSubscribeEvents } from '../../../../const/socketEvents/subscribers';

// handlers
import { handleUpdateUser } from './handleUpdateUser';
import { handleKickUser } from './handleKickUser';
import { handleUpdateUsers } from './handleUpdateUsers';
import { handleRemoveUsers } from './handleRemoveUsers';

// utils
import { emptyFunction } from '../../../../utils/functions/emptyFunction';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type UsersSocketHandlerDataMap = Map<UsersSubscribeEvents, SocketHandlerData>;

const USERS_SUBSCRIBE_HANDLERS_REGISTRY: UsersSocketHandlerDataMap = new Map([
    [UsersSubscribeEvents.OnRemoveUsers, { handler: handleRemoveUsers }],
    [UsersSubscribeEvents.OnUpdateUsers, { handler: handleUpdateUsers }],
    [UsersSubscribeEvents.OnKickUser, { handler: handleKickUser }],
    [UsersSubscribeEvents.OnUpdateUser, { handler: handleUpdateUser }],
]);

export const getUsersSocketSubscribeHandler = (
    eventName: UsersSubscribeEvents,
): SocketHandlerData['handler'] =>
    USERS_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction;
