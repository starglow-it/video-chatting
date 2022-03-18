import {
    $meetingTemplateStore,
    getMeetingTemplateFx,
    updateMeetingTemplateFx,
} from './model';
import {handleUpdateMeetingTemplate} from "./handlers/handleUpdateMeetingTemplate";
import {handleGetMeetingTemplate} from "./handlers/handleGetMeetingTemplate";

getMeetingTemplateFx.use(handleGetMeetingTemplate);
updateMeetingTemplateFx.use(handleUpdateMeetingTemplate);

$meetingTemplateStore
    .on(getMeetingTemplateFx.doneData, (state, data) => data)
    .on(updateMeetingTemplateFx.doneData, (state, data) => data);
