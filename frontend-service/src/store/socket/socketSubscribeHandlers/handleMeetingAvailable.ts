import { getMeetingTemplateFx } from '../../meeting/meetingTemplate/model';
import { initiateSocketConnectionFx } from '../model';
import { enterMeetingRequest, joinMeetingEventWithData } from '../../meeting/sockets/init';

export const handleMeetingAvailable = async ({ templateId }: { templateId: string }) => {
    const meetingTemplate = await getMeetingTemplateFx({ templateId });

    if (meetingTemplate?.meetingInstance?.serverIp) {
        await initiateSocketConnectionFx();

        await joinMeetingEventWithData({});

        enterMeetingRequest();
    }
};
