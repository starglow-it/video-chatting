// subscribe events
import { UsersSubscribeEvents } from '../../../../const/socketEvents/subscribers';

// handlers
import { handleUpdateUser } from './handleUpdateUser';
import { handleKickUser } from './handleKickUser';
import { handleGetMeetingStatistics } from './handleGetMeetingStatistics';
import { handleUpdateUsers } from './handleUpdateUsers';
import { handleRemoveUsers } from './handleRemoveUsers';

// utils
import { emptyFunction } from '../../../../utils/functions/emptyFunction';
import { handleReceiveAnswerSwitchRoleFromHost } from './handleReceiveAnswerSwitchRoleFromHost';
import { handleReceiveAnswerSwitchRoleFromAudience } from './handleReceiveAnswerSwitchRoleFromAudience';
import { handleReceiveRequestSwitchRoleByHost } from './handleReceiveRequestSwitchRoleByHost';
import { handleReceiveRequestSwitchRoleByAudience } from './handleReceiveRequestSwitchRoleByAudience';
import { handleReceiveRequestSwitchRoleFromParticipantToAudienceByHost } from './handleReceiveRequestSwitchRoleFromParticipantToAudienceByHost';
import { handleReceiveAnswerSwitchFromParticipantToAudienceRoleFromParticipant } from './handleReceiveAnswerSwitchFromParticipantToAudienceRoleFromParticipant';

type SocketHandlerData = {
    handler: (...args: any[]) => void;
};

type UsersSocketHandlerDataMap = Map<UsersSubscribeEvents, SocketHandlerData>;

const USERS_SUBSCRIBE_HANDLERS_REGISTRY: UsersSocketHandlerDataMap = new Map([
    [UsersSubscribeEvents.OnRemoveUsers, { handler: handleRemoveUsers }],
    [UsersSubscribeEvents.OnUpdateUsers, { handler: handleUpdateUsers }],
    [UsersSubscribeEvents.OnKickUser, { handler: handleKickUser }],
    [UsersSubscribeEvents.OnMeetingStatistics, { handler: handleGetMeetingStatistics }],
    [UsersSubscribeEvents.OnUpdateUser, { handler: handleUpdateUser }],
    [
        UsersSubscribeEvents.OnAnswerSwitchRoleByHost,
        { handler: handleReceiveAnswerSwitchRoleFromHost },
    ],
    [
        UsersSubscribeEvents.OnAnswerSwitchRoleByAudience,
        { handler: handleReceiveAnswerSwitchRoleFromAudience },
    ],
    [
        UsersSubscribeEvents.OnRequestSwitchRoleByHost,
        { handler: handleReceiveRequestSwitchRoleByHost },
    ],
    [
        UsersSubscribeEvents.OnRequestSwitchRoleByAudience,
        { handler: handleReceiveRequestSwitchRoleByAudience },
    ],
    [
        UsersSubscribeEvents.OnRequestSwitchFromParticipantToAudienceRoleByHost,
        { handler: handleReceiveRequestSwitchRoleFromParticipantToAudienceByHost },
    ],
    [
        UsersSubscribeEvents.OnAnswerSwitchFromParticipantToAudienceRoleByParticipant,
        { handler: handleReceiveAnswerSwitchFromParticipantToAudienceRoleFromParticipant },
    ],
]);

export const getUsersSocketSubscribeHandler = (
    eventName: UsersSubscribeEvents,
): SocketHandlerData['handler'] => {
    return USERS_SUBSCRIBE_HANDLERS_REGISTRY.get(eventName)?.handler || emptyFunction
};
