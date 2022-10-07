import { combine, sample } from 'effector-next';
import { resetRoomStores } from '../../../root';
import {
    $meetingStore,
    updateMeetingEvent,
    $meetingConnectedStore,
    setMeetingConnectedEvent,
    joinMeetingFx,
    joinMeetingEvent,
    joinMeetingInWaitingRoomFx,
} from './model';
import {
    $changeStreamStore,
    $currentAudioDeviceStore,
    $currentVideoDeviceStore,
    $isAuraActive,
    $isCameraActiveStore,
    $isMicActiveStore,
} from '../../videoChat/localMedia/model';
import {
    $isMeetingInstanceExists,
    $isOwner,
    $isOwnerInMeeting,
    $meetingTemplateStore,
} from '../meetingTemplate/model';
import { handleJoinMeting } from './handlers/handleJoinMeting';
import { handleJoinMetingInWaitingRoom } from './handlers/handleJoinMetingInWaitingRoom';
import { $localUserStore } from '../../users/localUser/model';
import { MeetingAccessStatuses } from '../../../types';

$meetingStore
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetRoomStores);

$meetingConnectedStore.on(setMeetingConnectedEvent, (state, data) => data).reset(resetRoomStores);

joinMeetingFx.use(handleJoinMeting);
joinMeetingInWaitingRoomFx.use(handleJoinMetingInWaitingRoom);

sample({
    clock: joinMeetingEvent,
    source: combine({
        isMicActive: $isMicActiveStore,
        isCameraActive: $isCameraActiveStore,
        isOwner: $isOwner,
        isOwnerInMeeting: $isOwnerInMeeting,
        isMeetingInstanceExists: $isMeetingInstanceExists,
        changeStream: $changeStreamStore,
        isAuraActive: $isAuraActive,
        currentVideoDevice: $currentVideoDeviceStore,
        currentAudioDevice: $currentAudioDeviceStore,
    }),
    fn: (store, params) => ({
        ...store,
        ...params,
    }),
    target: joinMeetingFx,
});

sample({
    clock: $meetingTemplateStore,
    source: combine({
        localUser: $localUserStore,
    }),
    filter: ({ localUser }, data) =>
        Boolean(data?.meetingInstance?.serverIp) &&
        data.meetingInstance.serverStatus === 'active' &&
        localUser.accessStatus === MeetingAccessStatuses.RequestSent,
    target: joinMeetingInWaitingRoomFx,
});
