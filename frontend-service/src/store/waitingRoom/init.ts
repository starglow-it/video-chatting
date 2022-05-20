import { combine, forward, sample } from 'effector-next';

import {
    emitJoinDashboard,
    emitSendEnterWaitingRoom,
    joinDashboard,
    sendEnterWaitingRoom,
    subscribeToSocketEvents,
} from './model';

import { $profileStore } from '../profile';
import { $localUserStore } from '../users';

import {
    ON_MEETING_AVAILABLE,
    ON_SEND_DASHBOARD_NOTIFICATION,
} from './const/subscribeSocketEvents';
import { initiateSocketConnectionFx } from '../socket';
import {$meetingTemplateStore, getMeetingTemplateFx, joinMeetingEventWithData} from '../meeting';
import { setDashboardNotifications } from '../dashboardNotifications';

import { DashboardNotification } from '../types/dashboard';

sample({
    clock: emitJoinDashboard,
    source: combine({ profile: $profileStore }),
    fn: ({ profile }) => ({ userId: profile.id }),
    target: joinDashboard,
});

sample({
    clock: emitSendEnterWaitingRoom,
    source: combine({
        profile: $profileStore,
        meetingTemplate: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    fn: ({ profile, meetingTemplate, localUser }) => ({
        profileId: profile.id,
        meetingUserId: localUser.id,
        templateId: meetingTemplate.id,
        username: localUser.username,
    }),
    target: sendEnterWaitingRoom,
});

forward({
    from: initiateSocketConnectionFx.doneData,
    to: subscribeToSocketEvents,
});

subscribeToSocketEvents.watch(({ socketInstance }) => {
    if (socketInstance) {
        socketInstance.on(ON_MEETING_AVAILABLE, async ({ templateId }: { templateId: string }) => {
            const meetingTemplate = await getMeetingTemplateFx({ templateId });

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await initiateSocketConnectionFx();

                await joinMeetingEventWithData();
            }
        });

        socketInstance.on(
            ON_SEND_DASHBOARD_NOTIFICATION,
            async ({ notification }: { notification: DashboardNotification }) => {
                setDashboardNotifications([notification]);
            },
        );
    }
});
