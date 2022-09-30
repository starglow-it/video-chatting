import { getMeetingTemplateFx } from '../../roomStores';

export const handleMeetingInstanceAvailable = message => {
    getMeetingTemplateFx({
        templateId: message.templateId,
    });
};
