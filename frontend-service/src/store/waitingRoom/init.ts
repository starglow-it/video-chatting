import {combine, forward, sample} from "effector-next";

import {
    emitJoinDashboard,
    emitSendEnterWaitingRoom,
    joinDashboard,
    sendEnterWaitingRoom,
    subscribeToSocketEvents
} from "./model";

import {$profileStore} from "../profile";

import {initiateMainSocketConnectionFx} from "../mainServerSocket";
import {ON_MEETING_AVAILABLE, ON_SEND_DASHBOARD_NOTIFICATION} from "./const/socketEvents";
import {initiateSocketConnectionFx} from "../socket";
import {$meetingTemplateStore, emitJoinMeetingEvent, getMeetingTemplateFx} from "../meeting";
import {DashboardNotification} from "../types/dashboard";
import {setDashboardNotifications} from "../dashboardNotifications";

sample({
    clock: emitJoinDashboard,
    source: combine({ profile: $profileStore }),
    fn: ({ profile }) => ({ userId: profile.id }),
    target: joinDashboard,
});

sample({
    clock: emitSendEnterWaitingRoom,
    source: combine({ profile: $profileStore, meetingTemplate: $meetingTemplateStore }),
    fn: ({ profile, meetingTemplate }) => ({ userId: profile.id, templateId: meetingTemplate.id }),
    target: sendEnterWaitingRoom,
});

forward({
    from: initiateMainSocketConnectionFx.doneData,
    to: subscribeToSocketEvents,
});

subscribeToSocketEvents.watch(({ socketInstance }) => {
    if (socketInstance) {
        socketInstance.on(ON_MEETING_AVAILABLE, async ({ templateId }: { templateId: string }) => {
            const meetingTemplate = await getMeetingTemplateFx({ templateId });

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await initiateSocketConnectionFx({ serverIp: meetingTemplate?.meetingInstance?.serverIp });

                emitJoinMeetingEvent();
            }
        });

        socketInstance.on(ON_SEND_DASHBOARD_NOTIFICATION, async ({ notification }: { notification: DashboardNotification }) => {
            setDashboardNotifications([notification]);
        });
    }
})