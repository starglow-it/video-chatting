import { attach, combine, Store } from 'effector-next';
import { joinDashboardSocketEvent, enterWaitingRoomSocketEvent } from './model';
import { $profileStore } from '../profile/profile/model';
import { $meetingTemplateStore } from '../meeting/meetingTemplate/model';
import { $localUserStore } from '../users/localUser/model';
import { Profile } from '../types';

export const sendJoinDashboardSocketEvent = attach<
    void,
    Store<{ profile: Profile }>,
    typeof joinDashboardSocketEvent
>({
    effect: joinDashboardSocketEvent,
    source: combine({ profile: $profileStore }),
    mapParams: (_, { profile }) => ({ userId: profile.id }),
});

export const sendEnterWaitingRoomSocketEvent = attach({
    effect: enterWaitingRoomSocketEvent,
    source: combine({
        profile: $profileStore,
        meetingTemplate: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    mapParams: (_, { profile, meetingTemplate, localUser }) => ({
        profileId: profile.id,
        meetingUserId: localUser.id,
        templateId: meetingTemplate.id,
        username: localUser.username,
    }),
});
