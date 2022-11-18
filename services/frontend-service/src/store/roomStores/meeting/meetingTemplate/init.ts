import {
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    setIsUserSendEnterRequest,
    getMeetingTemplateFx,
    updateMeetingTemplateFx,
    updateMeetingTemplateFxWithData,
    resetMeetingTemplateStoreEvent,
} from './model';
import { resetRoomStores } from '../../../root';

import { handleUpdateMeetingTemplate } from './handlers/handleUpdateMeetingTemplate';
import { handleGetMeetingTemplate } from './handlers/handleGetMeetingTemplate';
import { sendUpdateMeetingTemplateSocketEvent } from '../sockets/init';
import { getUserTemplateByIdFx, getUserTemplateFx } from '../../../templates/model';

getMeetingTemplateFx.use(handleGetMeetingTemplate);
updateMeetingTemplateFx.use(handleUpdateMeetingTemplate);

$meetingTemplateStore
    .on(getMeetingTemplateFx.doneData, (state, data) => data)
    .on(
        [getUserTemplateByIdFx.doneData, getUserTemplateFx.doneData],
        (state, data) => data || state,
    )
    .on(updateMeetingTemplateFx.doneData, (state, data) => data)
    .reset([resetRoomStores, resetMeetingTemplateStoreEvent]);

$isUserSendEnterRequest.on(setIsUserSendEnterRequest, (state, data) => data);

updateMeetingTemplateFxWithData.doneData.watch(() => {
    sendUpdateMeetingTemplateSocketEvent();
});
