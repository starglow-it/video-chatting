import { combine, sample } from 'effector-next';
import { MeetingAccessStatusEnum } from 'shared-types';
import { resetRoomStores, resetMeetingRecordingStore } from '../../../root';
import {
    $meetingStore,
    $meetingRecordingStore,
    updateMeetingEvent,
    $meetingConnectedStore,
    setMeetingConnectedEvent,
    joinMeetingFx,
    getMeetingUsersStatisticsFx,
    joinMeetingEvent,
    joinMeetingInWaitingRoomFx,
    joinMeetingWithAudienceFx,
    joinMeetingWithAudienceEvent,
    $activeTabPanel,
    setActiveTabPanelEvent,
    $isToggleLinksDrawer,
    toggleLinksDrawerEvent,
    updateMeetingTemplateDashFx,
    receiveRequestRecordingEvent,
    isRequestRecordingStartEvent,
    isRequestRecordingEndEvent,
    setRecordingUrlsEvent,
    setStartRecordingPendingEvent,
    setStopRecordingPendingEvent,
    resetMeetingRecordingStoreExceptVideosEvent,
    setRecordingUrlEvent,
    setUrlForCopyEvent
} from './model';
import {
    $changeStreamStore,
    $currentAudioDeviceStore,
    $currentVideoDeviceStore,
    $isAuraActive,
    $isCameraActiveStore,
    $isMicActiveStore,
} from '../../videoChat/localMedia/model';
import { $isPaywallPaid } from '../../users/localUser/model';
import { updateUserSocketEvent } from '../../users/init';
import {
    $isMeetingInstanceExists,
    $isOwnerDoNotDisturb,
    $isOwnerInMeeting,
    $meetingTemplateStore,
} from '../meetingTemplate/model';
import { handleGetMeetingUsers } from './handlers/handleGetMeetingUsersStatistics';
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

$meetingRecordingStore
    .on(setStopRecordingPendingEvent, (state, _) => ({ ...state, isStopRecordingPending: true }))
    .on(setStartRecordingPendingEvent, (state, _) => ({ ...state, isStartRecordingPending: true }))
    .on(setRecordingUrlEvent, (state, data) => ({ ...state, videos: [data, ...state.videos] }))
    .on(setRecordingUrlsEvent, (state, data) => ({ ...state, videos: data }))
    .on(isRequestRecordingStartEvent, (state, _) => ({ ...state, isRecordingStarted: true, byRequest: true }))
    .on(isRequestRecordingEndEvent, (state, _) => ({ ...state, byRequest: false }))
    .on(receiveRequestRecordingEvent, (state, data) => {
        if (state.requestUsers.findIndex(user => user.id === data.id) == -1) {
            return {
                ...state,
                requestUsers: [...state.requestUsers, data]
            }
        }
    })
    .on(setUrlForCopyEvent, (state, data) => ({ ...state, urlForCopy: data }))
    .on(resetMeetingRecordingStoreExceptVideosEvent, (state, _) =>
    ({
        ...state,
        requestUsers: [],
        isRecordingStarted: false,
        byRequest: false,
        isStartRecordingPending: false,
        isStopRecordingPending: false
    })
    )
    .reset(resetMeetingRecordingStore);

getMeetingUsersStatisticsFx.use(handleGetMeetingUsers);
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
        isOwnerDoNotDisturb: $isOwnerDoNotDisturb,
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

joinMeetingFx.doneData.watch(() => {
    const isPaywallPaid = $isPaywallPaid.getState();
    if (isPaywallPaid) {
        updateUserSocketEvent({ isPaywallPaid: true });
    }
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
