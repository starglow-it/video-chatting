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
import { resetRoomStores } from '../../../root';

import { handleUpdateMeetingTemplate } from './handlers/handleUpdateMeetingTemplate';
import { handleGetMeetingTemplate } from './handlers/handleGetMeetingTemplate';
import { handleCheckCustomLink } from './handlers/handleCheckCustomLink';
import { sendUpdateMeetingTemplateSocketEvent } from '../sockets/init';

getMeetingTemplateFx.use(handleGetMeetingTemplate);
updateMeetingTemplateFx.use(handleUpdateMeetingTemplate);
checkCustomLinkFx.use(handleCheckCustomLink);

$meetingTemplateStore
    .on(getMeetingTemplateFx.doneData, (state, data) => data)
    .on(updateMeetingTemplateFx.doneData, (state, data) => data)
    .reset([resetRoomStores, resetMeetingTemplateStoreEvent]);

$isUserSendEnterRequest.on(setIsUserSendEnterRequest, (state, data) => data);

updateMeetingTemplateFxWithData.doneData.watch(() => {
    sendUpdateMeetingTemplateSocketEvent();
});
