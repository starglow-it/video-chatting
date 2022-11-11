import {getUserTemplateByIdFx} from '../../templates/model';

export const handleMeetingAvailable = async ({ templateId }: { templateId: string }) => {
    getUserTemplateByIdFx({ templateId });
};
