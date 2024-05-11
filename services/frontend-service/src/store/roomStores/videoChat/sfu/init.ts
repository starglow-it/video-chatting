import { combine, sample } from 'effector-next';
import { MeetingRole } from 'shared-types';
import {
    $SFURoom,
    connectToSFUFx,
    getLiveKitTokenFx,
    publishTracksFx,
    toggleSFUPermissionsEvent,
    setSFUPermissionsFx,
    startSFUSharingEvent,
    stopSFUSharingEvent,
    startSFUSharingFx,
    stopSFUSharingFx,
    disconnectFromSFUFx,
    disconnectFromSFUEvent,
    initSFUVideoChat,
    changeSFUActiveStreamEvent,
    changeSFUActiveStreamFx,
    publishTracksEvent,
} from './model';
import { $localUserStore } from '../../users/localUser/model';
import { $meetingTemplateStore } from '../../meeting/meetingTemplate/model';
import {
    $activeStreamStore,
    $isCameraActiveStore,
    $isMicActiveStore,
} from '../localMedia/model';
import { $meetingStore } from '../../meeting/meeting/model';

import { handleGetLiveKitToken } from './handlers/handleGetLiveKitToken';
import { handlePublishTracks } from './handlers/handlePublishTracks';
import { handleConnectToSFU } from './handlers/handleConnectToSFU';
import { handleDisconnectFromSFU } from './handlers/handleDisconnectFromSFU';
import { handleSetSFUPermissions } from './handlers/handleSetSFUPermissions';
import { handleStartSFUSharing } from './handlers/handleStartSFUSharing';
import { handleStopSFUSharing } from './handlers/handleStopSFUSharing';
import { handleChangeSFUStream } from './handlers/handleChangeSFUStream';
import { updateMeetingSocketEvent } from '../../meeting/sockets/model';
import { $meetingRoleStore } from '../../meeting/meetingRole/model';

getLiveKitTokenFx.use(handleGetLiveKitToken);
publishTracksFx.use(handlePublishTracks);
connectToSFUFx.use(handleConnectToSFU);
setSFUPermissionsFx.use(handleSetSFUPermissions);
startSFUSharingFx.use(handleStartSFUSharing);
stopSFUSharingFx.use(handleStopSFUSharing);
disconnectFromSFUFx.use(handleDisconnectFromSFU);
changeSFUActiveStreamFx.use(handleChangeSFUStream);

$SFURoom
    .on(connectToSFUFx.doneData, (state, data) => data)
    .on(disconnectFromSFUFx.doneData, () => null);

sample({
    clock: initSFUVideoChat,
    source: combine({
        localUser: $localUserStore,
        template: $meetingTemplateStore,
    }),
    fn: ({ template, localUser }) => ({
        templateId: template.id,
        userId: localUser.id,
        serverIp: template.meetingInstance.serverIp,
        participantName: localUser.username
    }),
    target: connectToSFUFx,
});

sample({
    // clock: [connectToSFUFx.doneData, publishTracksEvent],
    clock: publishTracksEvent,
    source: combine({
        stream: $activeStreamStore,
        room: $SFURoom,
        localUser: $localUserStore,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
        role: $meetingRoleStore,
    }),
    filter: ({ role }) => role !== MeetingRole.Audience,
    target: publishTracksFx,
});

sample({
    clock: changeSFUActiveStreamEvent,
    source: combine({
        stream: $activeStreamStore,
        room: $SFURoom,
        localUser: $localUserStore,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
    }),
    target: changeSFUActiveStreamFx,
});

sample({
    clock: toggleSFUPermissionsEvent,
    source: combine({
        room: $SFURoom,
        isCameraActive: $isCameraActiveStore,
        isMicActive: $isMicActiveStore,
        localUser: $localUserStore,
    }),
    fn: ({ isCameraActive, isMicActive, room, localUser }, data) => ({
        isCameraActive: data.isCamEnabled ?? isCameraActive,
        isMicActive: data.isMicEnabled ?? isMicActive,
        room,
        userId: localUser.id,
    }),
    target: setSFUPermissionsFx,
});

sample({
    clock: publishTracksFx.done,
    source: combine({
        room: $SFURoom,
        localUser: $localUserStore,
    }),
    fn: ({ room, localUser }, { params }) => ({
        isCameraActive: params.isCameraActive,
        isMicActive: params.isMicActive,
        room,
        userId: localUser.id,
    }),
    target: setSFUPermissionsFx,
});

sample({
    clock: startSFUSharingEvent,
    source: combine({
        room: $SFURoom,
        localUser: $localUserStore,
    }),
    fn: ({ room, localUser }) => ({
        room,
        userId: localUser.id,
    }),
    target: startSFUSharingFx,
});

sample({
    clock: stopSFUSharingEvent,
    source: combine({
        room: $SFURoom,
        localUser: $localUserStore,
        meeting: $meetingStore,
    }),
    fn: ({ room, localUser, meeting }) => ({
        room,
        userId: localUser.id,
        sharingUserId: meeting.sharingUserId,
    }),
    target: stopSFUSharingFx,
});

sample({
    clock: disconnectFromSFUEvent,
    source: combine({
        room: $SFURoom,
    }),
    target: disconnectFromSFUFx,
});

startSFUSharingFx.done.watch(({ params }) => {
    updateMeetingSocketEvent({
        sharingUserId: params.userId,
    });
});

stopSFUSharingFx.done.watch(() => {
    updateMeetingSocketEvent({
        sharingUserId: null,
    });
});
