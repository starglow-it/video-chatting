import {
    getMeetingTemplateFx,
    sendJoinMeetingEventSocketEvent,
    emitEnterMeetingEvent,
} from '../../roomStores';

export const handleMeetingAvailable = async ({ templateId }: { templateId: string }) => {
    const meetingTemplate = await getMeetingTemplateFx({ templateId });

    if (
        meetingTemplate?.meetingInstance?.serverIp &&
        meetingTemplate.meetingInstance.serverStatus === 'active'
    ) {
        await sendJoinMeetingEventSocketEvent();

        emitEnterMeetingEvent();
    }
};
