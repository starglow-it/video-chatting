import { getMeetingTemplateFx } from '../../meetingTemplate/model';
import {IUserTemplate} from "shared-types";

export const handleUpdateMeetingTemplate = ({ templateId }: { templateId: IUserTemplate['id'] }) => {
    getMeetingTemplateFx({ templateId });
};
