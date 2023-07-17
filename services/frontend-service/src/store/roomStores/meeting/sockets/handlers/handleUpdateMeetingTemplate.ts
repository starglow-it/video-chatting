import { IUserTemplate } from 'shared-types';
import { getMeetingTemplateFx } from '../../meetingTemplate/model';

export const handleUpdateMeetingTemplate = ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}) => {
    getMeetingTemplateFx({ templateId });
};
