import { getMeetingTemplateFx } from '../../meeting/meetingTemplate/model';
import { joinMeetingEventWithData } from '../../meeting/sockets/init';
import { emitEnterMeetingEvent } from '../../meeting/sockets/model';

export const handleMeetingAvailable = async ({ templateId }: { templateId: string }) => {
    const meetingTemplate = await getMeetingTemplateFx({ templateId });

    if (meetingTemplate?.meetingInstance?.serverIp) {
        await joinMeetingEventWithData({});

        emitEnterMeetingEvent();
    }
};
