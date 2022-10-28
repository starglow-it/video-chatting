import { attach, combine, sample } from 'effector-next';

// stores
import { $meetingUsersStore, removeMeetingUsersEvent } from '../../users/meetingUsers/model';
import {
    changeP2PActiveStreamEvent,
    changeP2PActiveStreamFx,
    createPeerConnectionFx,
    disconnectFromP2PEvent,
    getAnswerFx,
    getIceCandidateFx,
    getOfferFx,
    removeConnectionsFx,
    removePeerConnection,
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
import { handleRemovePeerConnections } from './handlers/handleRemovePeerConnections';
import { handleGetOffer } from './handlers/handleGetOffer';
import { handleGetAnswer } from './handlers/handleGetAnswer';
import { handleGetIceCandidate } from './handlers/handleGetIceCandidate';
import { handleMapConnectionParams } from './handlers/handleMapConnectionParams';
import { handleChangeActiveP2PStream } from './handlers/handleChangeActiveP2PStream';

// types
import {
    AnswerExchangePayload,
    ConnectionsStore,
    CreatePeerConnectionsPayload,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../types';
import { Meeting, MeetingAccessStatuses, MeetingUser } from '../../../types';
import { ConnectionType, ServerTypes, StreamType } from '../../../../const/webrtc';
import { CustomMediaStream } from '../../../../types';

// utils
import { updateMeetingSocketEvent } from '../../meeting/sockets/model';
import { getConnectionKey } from '../../../../helpers/media/getConnectionKey';

createPeerConnectionFx.use(handleCreatePeerConnections);
stopScreenSharingFx.use(handleRemovePeerConnections);
removeConnectionsFx.use(handleRemovePeerConnections);
changeP2PActiveStreamFx.use(handleChangeActiveP2PStream);
getOfferFx.use(handleGetOffer);
getAnswerFx.use(handleGetAnswer);
getIceCandidateFx.use(handleGetIceCandidate);

$connectionsStore
    .on(createPeerConnectionFx.doneData, (state, data) => ({ ...state, ...data }))
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
                ([, connection]) => !data.includes(connection.connection.connectionId),
            ),
        ),
    )
    .on(removePeerConnection, (state, { connectionId }) =>
        Object.fromEntries(
            Object.entries(state).filter(
                ([, connection]) => connectionId !== connection.connection.connectionId,
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
    serverType: $serverTypeStore,
    isScreenSharingActive: $isScreenSharingStore,
    sharingStream: $sharingStream,
});

type SharingStore = {
    users: MeetingUser[];
    meeting: Meeting;
    localUser: MeetingUser;
    connections: ConnectionsStore;
    serverType: ServerTypes;
    isScreenSharingActive: boolean;
    sharingStream: CustomMediaStream;
};

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
                isInitial: true,
                connectionType: ConnectionType.VIEW,
                streamType: StreamType.VIDEO_CHAT,
            })),
        options: {
            isAudioEnabled: true,
            isVideoEnabled: true,
            isAuraActive,
            stream,
            onDisconnected: removePeerConnection,
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
        !createPeerConnectionFx.pending.getState() &&
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
                connectionType: ConnectionType.VIEW,
                streamType: StreamType.VIDEO_CHAT,
                isInitial: false,
            })),
        options: {
            isAudioEnabled: true,
            isVideoEnabled: true,
            isAuraActive,
            stream,
            onDisconnected: removePeerConnection,
        },
    }),
    target: createPeerConnectionFx,
});

sample({
    clock: startP2PSharingEvent,
    target: chooseSharingStreamFx,
});

sample({
    clock: chooseSharingStreamFx.doneData,
    source: $localUserStore,
    filter: (source, data) => Booelan(data?.id),
    fn: localUser => ({ sharingUserId: localUser.id }),
    target: updateMeetingSocketEvent,
});

sample({
    clock: [stopP2PSharingEvent, startP2PSharingFx.failData],
    fn: () => ({ sharingUserId: null }),
    target: updateMeetingSocketEvent,
});

/**
 React to sharing stream and create connection with existing users
 Create publish connections with isInitial = false - so wait for offer from view connections
 * */
sample({
    clock: chooseSharingStreamFx.doneData,
    source: sharingCommonStore,
    filter: (source, data) => Booelan(data?.id),
    fn: ({ users, connections, localUser, sharingStream }, data) => ({
        connectionsData: users
            .filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    !connections[
                        getConnectionKey({
                            userId: user.id,
                            connectionType: ConnectionType.PUBLISH,
                            streamType: StreamType.SCREEN_SHARING,
                        })
                    ],
            )
            .map(userData => ({
                userId: userData.id,
                socketId: userData.socketId,
                senderId: localUser.id,
                isInitial: false,
                connectionType: ConnectionType.PUBLISH,
                streamType: StreamType.SCREEN_SHARING,
            })),
        options: {
            stream: sharingStream ?? data,
            onTrackEnded: () => {
                updateMeetingSocketEvent({ sharingUserId: null });
            },
        },
    }),
    target: createPeerConnectionFx,
});

const mapViewSharingConnections = ({
    users,
    connections,
    localUser,
    meeting,
}: SharingStore): CreatePeerConnectionsPayload => ({
    connectionsData: users
        .filter(
            user =>
                meeting.sharingUserId === user.id &&
                user.accessStatus === MeetingAccessStatuses.InMeeting &&
                !connections[
                    getConnectionKey({
                        userId: user.id,
                        connectionType: ConnectionType.VIEW,
                        streamType: StreamType.SCREEN_SHARING,
                    })
                ],
        )
        .map(userData => ({
            userId: userData.id,
            socketId: userData.socketId,
            senderId: localUser.id,
            isInitial: true,
            connectionType: ConnectionType.VIEW,
            streamType: StreamType.SCREEN_SHARING,
        })),
    options: {},
});

/**
 React to active screen sharing user during meeting
 Create view connections with isInitial = true - so trigger connection logic with publish connection
 * */
sample({
    clock: $isScreenSharingStore,
    source: sharingCommonStore,
    filter: ({ localUser }, isScreenSharingActive) =>
        localUser.accessStatus === MeetingAccessStatuses.InMeeting && isScreenSharingActive,
    fn: mapViewSharingConnections,
    target: createPeerConnectionFx,
});

/**
 Initiate p2p screen sharing when join meeting to the p2p chat
 Create view connections with isInitial = true - so trigger connection logic with publish connection
 * */
sample({
    clock: initP2PVideoChat,
    source: sharingCommonStore,
    filter: ({ meeting, localUser, isScreenSharingActive }) =>
        meeting.sharingUserId !== localUser.id && isScreenSharingActive,
    fn: mapViewSharingConnections,
    target: createPeerConnectionFx,
});

/**
    React to users join meeting during screen sharing
 1. Create publish connections
 2. Wait for get offer event because peer connections with isInitial set to false.
    This means that local peer connection will wait for connection trigger
* */
sample({
    clock: combine({ isScreenSharing: $isScreenSharingStore, users: $meetingUsersStore }),
    source: sharingCommonStore,
    filter: ({ localUser, meeting }, { isScreenSharing }) =>
        localUser.accessStatus === MeetingAccessStatuses.InMeeting &&
        isScreenSharing &&
        meeting.sharingUserId === localUser.id,
    fn: ({ users, connections, localUser, sharingStream }) => ({
        connectionsData: users
            .filter(
                user =>
                    localUser.id !== user.id &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    !connections[
                        getConnectionKey({
                            userId: user.id,
                            connectionType: ConnectionType.PUBLISH,
                            streamType: StreamType.SCREEN_SHARING,
                        })
                    ],
            )
            .map(userData => ({
                userId: userData.id,
                socketId: userData.socketId,
                senderId: localUser.id,
                isInitial: false,
                connectionType: ConnectionType.PUBLISH,
                streamType: StreamType.SCREEN_SHARING,
            })),
        options: {
            stream: sharingStream,
        },
    }),
    target: createPeerConnectionFx,
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
