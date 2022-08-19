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
    getUsersTemplatesFx,
    sendScheduleInviteFx,
    setScheduleEventLinkEvent,
    setScheduleTemplateIdEvent,
    purchaseTemplateFx,
    getUserTemplateFx,
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

getTemplatesFx.use(handleFetchTemplates);
getTemplateFx.use(handleFetchCommonTemplate);
getUsersTemplatesFx.use(handleFetchUsersTemplates);
getUserTemplateFx.use(handleFetchUserTemplate);
purchaseTemplateFx.use(handlePurchaseTemplate);
sendScheduleInviteFx.use(handleSendScheduleInvite);

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

$replaceTemplateIdStore.on(setReplaceTemplateIdEvent, (state, data) => data);

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});
