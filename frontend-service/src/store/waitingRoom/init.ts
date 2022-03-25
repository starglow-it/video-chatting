import {combine, forward, sample} from "effector-next";

import {emitJoinDashboard, joinDashboard, subscribeToSocketEvents} from "./model";
import {$profileStore} from "../profile";

import {initiateMainSocketConnectionFx} from "../mainServerSocket";
import {ON_MEETING_AVAILABLE} from "./const/socketEvents";
import {initiateSocketConnectionFx} from "../socket";
import {emitJoinMeetingEvent, getMeetingTemplateFx} from "../meeting";

sample({
    clock: emitJoinDashboard,
    source: combine({ profile: $profileStore }),
    fn: ({ profile }) => ({ userId: profile.id }),
    target: joinDashboard,
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
    }
})