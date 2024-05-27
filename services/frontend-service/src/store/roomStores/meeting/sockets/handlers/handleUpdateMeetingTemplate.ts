import { IUserTemplate } from 'shared-types';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { getMeetingTemplateFx, updateBackgroundFx } from '../../meetingTemplate/model';

export const handleUpdateMeetingTemplate = (data: Partial<IUserTemplate>) => {
    updateBackgroundFx(data);    
};
