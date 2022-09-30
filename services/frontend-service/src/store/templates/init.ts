import { forward } from 'effector';

import {
    $setUpTemplateStore,
    getTemplateFx,
    $templatePreviewStore,
    setPreviewTemplate,
    $replaceTemplateIdStore,
    $templatesStore,
    getTemplatesFx,
    setReplaceTemplateIdEvent,
    $discoveryTemplatesStore,
    $scheduleEventLinkStore,
    $scheduleTemplateIdStore,
    $templateDraft,
    getUsersTemplatesFx,
    sendScheduleInviteFx,
    setScheduleEventLinkEvent,
    setScheduleTemplateIdEvent,
    purchaseTemplateFx,
    getUserTemplateFx,
    uploadTemplateFileFx,
    editTemplateFx,
    createTemplateFx,
    getEditingTemplateFx,
    uploadUserTemplateFileFx,
    editUserTemplateFileFx,
    clearTemplateDraft,
} from './model';

import { appDialogsApi } from '../dialogs/init';

// types
import { AppDialogsEnum, Template } from '../types';

// handlers
import { handleFetchUsersTemplates } from './handlers/handleFetchUsersTemplates';
import { handleFetchUserTemplate } from './handlers/handleFetchUsersTemplate';
import { handleSendScheduleInvite } from './handlers/handleSendScheduleInvite';
import { handleFetchTemplates } from './handlers/handleFetchTemplates';
import { handleFetchCommonTemplate } from './handlers/handleFetchCommonTemplate';
import { handlePurchaseTemplate } from './handlers/handlePurchaseTemplate';
import { handleEditTemplate } from './handlers/handleEditTemplate';
import { handleCreateTemplate } from './handlers/handleCreateTemplate';
import {
    handleUpdateMeetingTemplate
} from '../roomStores/meeting/meetingTemplate/handlers/handleUpdateMeetingTemplate';

getTemplatesFx.use(handleFetchTemplates);
getTemplateFx.use(handleFetchCommonTemplate);
getUsersTemplatesFx.use(handleFetchUsersTemplates);
getUserTemplateFx.use(handleFetchUserTemplate);
purchaseTemplateFx.use(handlePurchaseTemplate);
sendScheduleInviteFx.use(handleSendScheduleInvite);
createTemplateFx.use(handleCreateTemplate);
uploadTemplateFileFx.use(handleEditTemplate);
editTemplateFx.use(handleEditTemplate);
getEditingTemplateFx.use(handleFetchUserTemplate);
uploadUserTemplateFileFx.use(handleUpdateMeetingTemplate);
editUserTemplateFileFx.use(handleUpdateMeetingTemplate);

$templatesStore.on(getTemplatesFx.doneData, (state, data) => ({
    ...state,
    ...data,
}));
$templatePreviewStore.on(setPreviewTemplate, (_state, data: Template | null) => data);
$setUpTemplateStore.on(getTemplateFx.doneData, (state, data) => data);
$discoveryTemplatesStore.on(getUsersTemplatesFx.doneData, (state, data) => ({
    ...state,
    ...data,
}));
$scheduleTemplateIdStore.on(setScheduleTemplateIdEvent, (state, data) => data);
$scheduleEventLinkStore.on(setScheduleEventLinkEvent, (state, data) => {
    if (data) {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.downloadIcsEventDialog,
        });
    } else {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.downloadIcsEventDialog,
        });
    }

    return data;
});
$templateDraft.on(createTemplateFx.doneData, (state, data) => data);
$templateDraft.on(editTemplateFx.doneData, (state, data) => data);
$templateDraft.on(getEditingTemplateFx.doneData, (state, data) => data);
$templateDraft.on(editUserTemplateFileFx.doneData, (state, data) => data);
$templateDraft.reset(clearTemplateDraft);

$replaceTemplateIdStore.on(setReplaceTemplateIdEvent, (state, data) => data);

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});
