import { Store, attach, combine } from 'effector-next';

import { $profileStore } from 'src/store/profile/profile/model';
import { ICommonUser, IUserTemplate, MeetingRole } from 'shared-types';
import { $scheduleTemplateStore } from 'src/store/templates/model';
import { Meeting, MeetingRecording, MeetingUser, Profile } from '../../../types';
import { meetingDomain } from '../../../domains';
import { $localUserStore } from '../../users/localUser/model';
import {
    JoinMeetingEventPayload,
    JoinMeetingFxPayload,
    GetMeetingUsersStatisticsPayload,
    JoinMeetingWithAudienceFxPayload,
} from './types';
import { joinWaitingRoomSocketEvent } from '../sockets/model';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import { $meetingRoleStore } from '../meetingRole/model';

const initialMeetingState: Meeting = {
    id: '',
    isMonetizationEnabled: false,
    mode: 'together',
    owner: '',
    users: [],
    ownerProfileId: '',
    hostUserId: '',
};

const initialMeetingRecordingState: MeetingRecording = {
    videos: [],
    requestUsers: [],
    isRecordingStarted: false,
    byRequest: false,
    isStartRecordingPending: false,
    isStopRecordingPending: false,
    urlForCopy: ''
}
export const $meetingStore =
    meetingDomain.createStore<Meeting>(initialMeetingState);
export const $meetingConnectedStore = meetingDomain.createStore<boolean>(false);

export const $meetingRecordingStore =
    meetingDomain.createStore<MeetingRecording>(initialMeetingRecordingState);

export const $isMeetingHostStore = combine({
    localUser: $localUserStore,
    meeting: $meetingStore,
}).map(({ localUser, meeting }) => localUser.id === meeting.hostUserId);

export const $isScreenSharingStore = $meetingStore.map(meeting =>
    Boolean(meeting.sharingUserId),
);

export const $activeTabPanel = meetingDomain.createStore<number>(0);

export const $isToggleLinksDrawer = meetingDomain.createStore(false);

export const setActiveTabPanelEvent = meetingDomain.createEvent<number>(
    'setActiveTabPanelEvent',
);

export const updateMeetingEvent = meetingDomain.createEvent<{
    meeting?: Meeting;
}>('updateMeetingEvent');

export const setMeetingConnectedEvent = meetingDomain.createEvent<boolean>(
    'setMeetingConnectedEvent',
);

export const joinMeetingFx = meetingDomain.createEffect<
    JoinMeetingFxPayload,
    void
>('joinMeetingFx');

export const getMeetingUsersStatisticsFx = meetingDomain.createEffect<
    GetMeetingUsersStatisticsPayload,
    void
>('getMeetingUsersStatisticsFx');

export const joinMeetingInWaitingRoomFx = meetingDomain.createEffect<
    void,
    void
>('joinMeetingInWaitingRoomFx');
export const joinMeetingEvent =
    meetingDomain.createEvent<JoinMeetingEventPayload>('joinMeetingEvent');

export const joinMeetingWithAudienceEvent = meetingDomain.createEvent(
    'joinMeetingWithAudienceEvent',
);

export const joinMeetingWithAudienceFx = meetingDomain.createEffect<
    JoinMeetingWithAudienceFxPayload,
    void
>('joinMeetingWithAudienceFx');

export const toggleLinksDrawerEvent = meetingDomain.createEvent<
    undefined | boolean
>('toggleLinksDrawerEvent');

export const rejoinMeetingEvent = attach<
    void,
    Store<{
        profile: ICommonUser;
        template: IUserTemplate;
        localUser: MeetingUser;
        meetingRole: MeetingRole;
    }>,
    typeof joinWaitingRoomSocketEvent
>({
    effect: joinWaitingRoomSocketEvent,
    source: combine({
        profile: $profileStore,
        template: $meetingTemplateStore,
        localUser: $localUserStore,
        meetingRole: $meetingRoleStore,
    }),
    mapParams: (
        data,
        source: {
            profile: Profile;
            template: IUserTemplate;
            localUser: MeetingUser;
            meetingRole: MeetingRole;
        },
    ) => ({
        profileId: source.profile?.id,
        profileUserName: source?.profile?.fullName,
        profileAvatar: source?.profile?.profileAvatar?.url,
        templateId: source.template?.id,
        meetingRole: source.meetingRole,
        accessStatus: source.localUser.accessStatus,
        isAuraActive: source.localUser.isAuraActive,
        cameraStatus: source.localUser.cameraStatus,
        micStatus: source.localUser.micStatus,
        maxParticipants: source.template.maxParticipants,
    }),
});

export const updateMeetingTemplateDashFx = meetingDomain.createEffect<
    {
        data: Partial<IUserTemplate>;
        templateId: string;
    },
    void
>('updateMeetingTemplateDashFx');

export const sendUpdateMeetingTemplateEvent = attach<
    Partial<IUserTemplate>,
    Store<{ template: Partial<IUserTemplate> }>,
    typeof updateMeetingTemplateDashFx
>({
    effect: updateMeetingTemplateDashFx,
    source: combine({ template: $scheduleTemplateStore }),
    mapParams: (params, { template }) => ({
        templateId: template.id ?? '',
        data: params,
    }),
});

export const isRequestRecordingStartEvent = meetingDomain.createEvent<void>('isRequestRecordingStartEvent');
export const isRequestRecordingEndEvent = meetingDomain.createEvent<void>('isRequestRecordingEndEvent');

export const receiveRequestRecordingEvent = meetingDomain.createEvent<MeetingUser>('receiveRequestRecordingEvent');

export const setRecordingUrlEvent = meetingDomain.createEvent<{ id: string, endTime: string }>('setRecordingUrlEvent');
export const setRecordingUrlsEvent = meetingDomain.createEvent<{ id: string, endTime: string }[]>('setRecordingUrlsEvent');
export const setStartRecordingPendingEvent = meetingDomain.createEvent<void>('setStartRecordingPendingEvent');
export const setStopRecordingPendingEvent = meetingDomain.createEvent<void>('setStopRecordingPendingEvent');
export const resetMeetingRecordingStoreExceptVideosEvent = meetingDomain.createEvent<void>('resetMeetingRecordingStoreExceptVideosEvent');
export const setUrlForCopyEvent = meetingDomain.createEvent<string>('setUrlForCopyEvent');