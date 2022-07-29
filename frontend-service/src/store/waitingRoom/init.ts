import { attach, combine } from 'effector-next';
import { joinDashboardSocketEvent, sendEnterWaitingRoomSocketEvent } from './model';
import { $profileStore } from '../profile/profile/model';
import { $meetingTemplateStore } from '../meeting/meetingTemplate/model';
import { $localUserStore } from '../users/localUser/model';

export const joinDashboard = attach({
    effect: joinDashboardSocketEvent,
    source: combine({ profile: $profileStore }),
    mapParams: (_, { profile }) => ({ userId: profile.id }),
});

export const sendEnterWaitingRoom = attach({
    effect: sendEnterWaitingRoomSocketEvent,
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
