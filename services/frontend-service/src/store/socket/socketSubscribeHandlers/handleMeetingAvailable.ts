import { getUserTemplateFx } from '../../templates/model';

export const handleMeetingAvailable = async ({ templateId }: { templateId: string }) => {
    getUserTemplateFx({ templateId, withCredentials: false });
};
