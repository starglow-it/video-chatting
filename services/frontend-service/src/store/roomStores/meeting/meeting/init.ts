import { combine, sample } from 'effector-next';
import { MeetingAccessStatusEnum } from 'shared-types';
import { resetRoomStores } from '../../../root';
import {
    $meetingStore,
    updateMeetingEvent,
    $meetingConnectedStore,
    setMeetingConnectedEvent,
    joinMeetingFx,
    joinMeetingEvent,
    joinMeetingInWaitingRoomFx,
    joinMeetingWithAudienceFx,
    joinMeetingWithAudienceEvent,
    $activeTabPanel,
    setActiveTabPanelEvent,
    $isToggleLinksDrawer,
    toggleLinksDrawerEvent,
    updateMeetingTemplateDashFx,
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
    $isOwnerInMeeting,
    $meetingTemplateStore,
} from '../meetingTemplate/model';
import { handleJoinMeting } from './handlers/handleJoinMeting';
import { handleJoinMetingInWaitingRoom } from './handlers/handleJoinMetingInWaitingRoom';
import { $localUserStore } from '../../users/localUser/model';
import { $meetingRoleStore } from '../meetingRole/model';
import { handleJoinMeetingWithAudience } from './handlers/handleJoinMeetingWithAudience';
import { handleUpdateMeetingTemplateDash } from './handlers/handleUpdateMeetingTemplateDash';

$meetingStore
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetRoomStores);

$meetingConnectedStore
    .on(setMeetingConnectedEvent, (state, data) => data)
    .reset(resetRoomStores);

$activeTabPanel
    .on(setActiveTabPanelEvent, (_, tab) => tab)
    .reset(resetRoomStores);

$isToggleLinksDrawer
    .on(toggleLinksDrawerEvent, (toggle, newToggle) =>
        newToggle !== undefined ? newToggle : !toggle,
    )
    .reset(resetRoomStores);

joinMeetingFx.use(handleJoinMeting);
joinMeetingInWaitingRoomFx.use(handleJoinMetingInWaitingRoom);
joinMeetingWithAudienceFx.use(handleJoinMeetingWithAudience);
updateMeetingTemplateDashFx.use(handleUpdateMeetingTemplateDash);

sample({
    clock: joinMeetingEvent,
    source: combine({
        isMicActive: $isMicActiveStore,
        isCameraActive: $isCameraActiveStore,
        // isOwner: $isOwner,
        isOwnerInMeeting: $isOwnerInMeeting,
        isMeetingInstanceExists: $isMeetingInstanceExists,
        changeStream: $changeStreamStore,
        isAuraActive: $isAuraActive,
        currentVideoDevice: $currentVideoDeviceStore,
        currentAudioDevice: $currentAudioDeviceStore,
        meetingRole: $meetingRoleStore,
    }),
    fn: (store, params) => ({
        ...store,
        ...params,
    }),
    target: joinMeetingFx,
});

sample({
    clock: joinMeetingWithAudienceEvent,
    source: combine({
        isMicActive: $isMicActiveStore,
        isCameraActive: $isCameraActiveStore,
        changeStream: $changeStreamStore,
        isAuraActive: $isAuraActive,
    }),
    target: joinMeetingWithAudienceFx,
});

/**
 * This logic will handle case
 * when user waiting host
 */
sample({
    clock: $meetingTemplateStore,
    source: combine({
        localUser: $localUserStore,
    }),
    filter: ({ localUser }, data) =>
        Boolean(data?.meetingInstance?.serverIp) &&
        data.meetingInstance.serverStatus === 'active' &&
        localUser.accessStatus === MeetingAccessStatusEnum.Waiting,
    target: joinMeetingInWaitingRoomFx,
});
