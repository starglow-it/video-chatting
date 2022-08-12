import {
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    setIsUserSendEnterRequest,
    getMeetingTemplateFx,
    updateMeetingTemplateFx,
    updateMeetingTemplateFxWithData,
    checkCustomLinkFx,
    resetMeetingTemplateStoreEvent,
} from './model';
import { emitUpdateMeetingTemplate } from '../sockets/model';

import { handleUpdateMeetingTemplate } from './handlers/handleUpdateMeetingTemplate';
import { handleGetMeetingTemplate } from './handlers/handleGetMeetingTemplate';
import { handleCheckCustomLink } from './handlers/handleCheckCustomLink';

getMeetingTemplateFx.use(handleGetMeetingTemplate);
updateMeetingTemplateFx.use(handleUpdateMeetingTemplate);
checkCustomLinkFx.use(handleCheckCustomLink);

$meetingTemplateStore
    .on(getMeetingTemplateFx.doneData, (state, data) => data)
    .on(updateMeetingTemplateFx.doneData, (state, data) => data);

$meetingTemplateStore.reset(resetMeetingTemplateStoreEvent);

$isUserSendEnterRequest.on(setIsUserSendEnterRequest, (state, data) => data);

updateMeetingTemplateFxWithData.doneData.watch(() => {
    emitUpdateMeetingTemplate();
});
