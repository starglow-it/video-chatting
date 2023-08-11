import { IUserTemplate } from 'shared-types';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { getMeetingTemplateFx } from '../../meetingTemplate/model';

export const handleUpdateMeetingTemplate = ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}) => {
    getMeetingTemplateFx({
        templateId,
        subdomain: isSubdomain() ? window.location.origin : undefined,
    });
};
