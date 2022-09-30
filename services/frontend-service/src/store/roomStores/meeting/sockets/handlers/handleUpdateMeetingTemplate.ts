import { getMeetingTemplateFx } from '../../meetingTemplate/model';
import { UserTemplate } from '../../../../types';

export const handleUpdateMeetingTemplate = ({ templateId }: { templateId: UserTemplate['id'] }) => {
    getMeetingTemplateFx({ templateId });
};
