import { attach, combine, sample } from 'effector-next';

// stores
import { $meetingUsersStore, removeMeetingUsersEvent } from '../../users/meetingUsers/model';
import {
    changeP2PActiveStreamEvent,
    changeP2PActiveStreamFx,
    createLocalPeerConnectionsFx,
    createPeerConnectionFx,
    disconnectFromP2PEvent,
    getAnswerFx,
    getIceCandidateFx,
    getOfferFx,
    removeConnectionsFx,
    startP2PSharingEvent,
    startP2PSharingFx,
    stopP2PSharingEvent,
    stopScreenSharingFx,
} from './model';
import { $connectionsStore, $serverTypeStore, initP2PVideoChat } from '../model';
import { $localUserStore } from '../../users/localUser/model';
import {
    $activeStreamStore,
    $isAuraActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $sharingStream,
    chooseSharingStreamFx,
} from '../localMedia/model';
import { $isScreenSharingStore, $meetingStore } from '../../meeting/meeting/model';
import { resetRoomStores } from '../../../root';

// handlers
import { handleCreatePeerConnections } from './handlers/handleCreatePeerConnections';
import { handleCreateLocalPeerConnections } from './handlers/handleCreateLocalPeerConnections';
import { handleRemovePeerConnections } from './handlers/handleRemovePeerConnections';
import { handleGetOffer } from './handlers/handleGetOffer';
import { handleGetAnswer } from './handlers/handleGetAnswer';
import { handleGetIceCandidate } from './handlers/handleGetIceCandidate';
import { handleStartScreenSharing } from './handlers/handleStartScreenSharing';
import { handleMapConnectionParams } from './handlers/handleMapConnectionParams';
import { handleChangeActiveP2PStream } from './handlers/handleChangeActiveP2PStream';

// types
import {
    AnswerExchangePayload,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../types';
import { MeetingAccessStatuses } from '../../../types';
import { ConnectionType, ServerTypes, StreamType } from '../../../../const/webrtc';

// utils
import { getConnectionKey } from '../helpers/getConnectionKey';
import { updateMeetingSocketEvent } from '../../meeting/sockets/model';

createPeerConnectionFx.use(handleCreatePeerConnections);
createLocalPeerConnectionsFx.use(handleCreateLocalPeerConnections);
startP2PSharingFx.use(handleStartScreenSharing);
stopScreenSharingFx.use(handleRemovePeerConnections);
removeConnectionsFx.use(handleRemovePeerConnections);
changeP2PActiveStreamFx.use(handleChangeActiveP2PStream);
getOfferFx.use(handleGetOffer);
getAnswerFx.use(handleGetAnswer);
getIceCandidateFx.use(handleGetIceCandidate);

$connectionsStore
    .on(createPeerConnectionFx.doneData, (state, data) => data)
    .on(createLocalPeerConnectionsFx.doneData, (state, data) => ({ ...state, ...data }))
    .on(startP2PSharingFx.doneData, (state, data) => ({ ...state, ...data }))
    .on(stopScreenSharingFx.doneData, state =>
        Object.fromEntries(
            Object.entries(state).filter(
                ([, connection]) => connection.connection.streamType !== StreamType.SCREEN_SHARING,
            ),
        ),
    )
    .on([removeConnectionsFx.doneData], (state, data) =>
        Object.fromEntries(
            Object.entries(state).filter(
                ([, connection]) => !data.includes(connection.connection.userId),
            ),
        ),
    )
    .reset(resetRoomStores);

const connectionsCommonStore = combine({
    users: $meetingUsersStore,
    connections: $connectionsStore,
    localUser: $localUserStore,
    stream: $activeStreamStore,
    isAuraActive: $isAuraActive,
    serverType: $serverTypeStore,
});

const sharingCommonStore = combine({
    users: $meetingUsersStore,
    meeting: $meetingStore,
    localUser: $localUserStore,
    connections: $connectionsStore,
    sharingStream: $sharingStream,
});

const exchangeStore = combine({
    connections: $connectionsStore,
    localUser: $localUserStore,
    meeting: $meetingStore,
});

sample({
    clock: initP2PVideoChat,
    source: connectionsCommonStore,
    fn: ({ users, localUser, stream, isAuraActive }) => ({
        connectionsData: users
            .filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting,
            )
            .map(userData => ({
                userId: userData.id,
                socketId: userData.socketId,
                senderId: localUser.id,
                isLocal: false,
            })),
        options: {
            isAudioEnabled: true,
            isVideoEnabled: true,
            isAuraActive,
            stream,
        },
    }),
    target: createPeerConnectionFx,
});

sample({
    clock: combine({ meetingUsers: $meetingUsersStore, serverType: $serverTypeStore }),
    source: connectionsCommonStore,
    filter: ({ localUser, users, connections, serverType }) =>
        serverType === ServerTypes.P2P &&
        localUser.accessStatus === MeetingAccessStatuses.InMeeting &&
        Boolean(
            users.filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    !connections[
                        getConnectionKey({
                            userId: user.id,
                            connectionType: ConnectionType.VIEW,
                            streamType: StreamType.VIDEO_CHAT,
                        })
                    ],
            )?.length,
        ),
    fn: ({ users, connections, stream, localUser, isAuraActive }) => ({
        connectionsData: users
            .filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    !connections[
                        getConnectionKey({
                            userId: user.id,
                            connectionType: ConnectionType.VIEW,
                            streamType: StreamType.VIDEO_CHAT,
                        })
                    ],
            )
            .map(userData => ({
                userId: userData.id,
                socketId: userData.socketId,
                senderId: localUser.id,
                isLocal: false,
            })),
        options: {
            isAudioEnabled: true,
            isVideoEnabled: true,
            isAuraActive,
            stream,
        },
    }),
    target: createLocalPeerConnectionsFx,
});

sample({
    clock: startP2PSharingEvent,
    source: $localUserStore,
    fn: localUser => ({ sharingUserId: localUser.id }),
    target: chooseSharingStreamFx,
});

sample({
    clock: chooseSharingStreamFx.doneData,
    source: $localUserStore,
    fn: localUser => ({ sharingUserId: localUser.id }),
    target: updateMeetingSocketEvent,
});

sample({
    clock: stopP2PSharingEvent,
    fn: () => ({ sharingUserId: null }),
    target: updateMeetingSocketEvent,
});

sample({
    clock: $isScreenSharingStore,
    source: sharingCommonStore,
    filter: (state, data) => data,
    fn: ({ users, connections, sharingStream, localUser, meeting }) => ({
        connectionsData: users
            .filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    !connections[
                        getConnectionKey({
                            userId: user.id,
                            connectionType:
                                meeting.sharingUserId === localUser.id
                                    ? ConnectionType.PUBLISH
                                    : ConnectionType.VIEW,
                            streamType: StreamType.SCREEN_SHARING,
                        })
                    ],
            )
            .map(userData => ({
                userId: userData.id,
                socketId: userData.socketId,
                senderId: localUser.id,
                isLocal: meeting.sharingUserId === localUser.id,
            })),
        options: {
            stream: sharingStream,
        },
    }),
    target: startP2PSharingFx,
});

sample({
    clock: $isScreenSharingStore,
    source: $connectionsStore,
    filter: (state, data) => !data,
    fn: connections =>
        Object.fromEntries(
            Object.entries(connections).filter(
                ([, connection]) => connection.connection.streamType === StreamType.SCREEN_SHARING,
            ),
        ),
    target: stopScreenSharingFx,
});

sample({
    clock: removeMeetingUsersEvent,
    source: $connectionsStore,
    fn: (connections, data) =>
        Object.fromEntries(
            Object.entries(connections).filter(([, connection]) =>
                data.users.includes(connection.connection.userId),
            ),
        ),
    target: removeConnectionsFx,
});

sample({
    clock: disconnectFromP2PEvent,
    source: $connectionsStore,
    target: removeConnectionsFx,
});

sample({
    clock: changeP2PActiveStreamEvent,
    source: combine({
        connections: $connectionsStore,
        stream: $activeStreamStore,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
    }),
    target: changeP2PActiveStreamFx,
});

export const getOfferFxWithStore = attach<
    OfferExchangePayload,
    typeof exchangeStore,
    typeof getOfferFx
>({
    effect: getOfferFx,
    source: exchangeStore,
    mapParams: handleMapConnectionParams,
});

export const getAnswerFxWithStore = attach<
    AnswerExchangePayload,
    typeof exchangeStore,
    typeof getAnswerFx
>({
    effect: getAnswerFx,
    source: exchangeStore,
    mapParams: handleMapConnectionParams,
});

export const getIceCandidateFxWithStore = attach<
    IceCandidatesExchangePayload,
    typeof exchangeStore,
    typeof getIceCandidateFx
>({
    effect: getIceCandidateFx,
    source: exchangeStore,
    mapParams: handleMapConnectionParams,
});
