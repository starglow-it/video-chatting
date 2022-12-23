import { forward } from 'effector';

import {
    $discoveryTemplatesStore,
    $replaceTemplateIdStore,
    $scheduleEventLinkStore,
    $scheduleTemplateIdStore,
    $setUpTemplateStore,
    $templateDraft,
    $templatePreviewStore,
    $templatesStore,
    addTemplateToUserFx,
    clearTemplateDraft,
    createTemplateFx,
    deleteCommonTemplateFx,
    editTemplateFx,
    getEditingTemplateFx,
    getTemplateFx,
    getTemplatesFx,
    getUsersTemplatesFx,
    getUserTemplateByIdFx,
    getUserTemplateFx,
    purchaseTemplateFx,
    sendScheduleInviteFx,
    setPreviewTemplate,
    setReplaceTemplateIdEvent,
    setScheduleEventLinkEvent,
    setScheduleTemplateIdEvent,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
} from './model';

import { appDialogsApi } from '../dialogs/init';
import {clearProfileEvent} from "../profile/profile/model";

// types
import { AppDialogsEnum } from '../types';
import {ICommonTemplate} from "shared-types";

// handlers
import { handleFetchUsersTemplates } from './handlers/handleFetchUsersTemplates';
import { handleFetchUserTemplate } from './handlers/handleFetchUsersTemplate';
import { handleSendScheduleInvite } from './handlers/handleSendScheduleInvite';
import { handleFetchTemplates } from './handlers/handleFetchTemplates';
import { handleFetchCommonTemplate } from './handlers/handleFetchCommonTemplate';
import { handlePurchaseTemplate } from './handlers/handlePurchaseTemplate';
import { handleEditTemplate } from './handlers/handleEditTemplate';
import { handleCreateTemplate } from './handlers/handleCreateTemplate';
import { handleUploadTemplateFile } from './handlers/handleUploadTemplateFile';
import { handleUploadUserTemplateFile } from './handlers/handleUploadUserTemplateFile';
import { handleAddTemplateToUser } from './handlers/handleAddTemplateToUser';
import { handleDeleteCommonTemplate } from './handlers/handleDeleteCommonTemplate';
import { handleGetUserTemplate } from './handlers/handleGetUserTemplate';
import {editUserTemplateFx} from "../profile/profileTemplates/model";

getTemplatesFx.use(handleFetchTemplates);
getTemplateFx.use(handleFetchCommonTemplate);
getUsersTemplatesFx.use(handleFetchUsersTemplates);
getUserTemplateFx.use(handleFetchUserTemplate);
getUserTemplateByIdFx.use(handleGetUserTemplate);
purchaseTemplateFx.use(handlePurchaseTemplate);
sendScheduleInviteFx.use(handleSendScheduleInvite);
createTemplateFx.use(handleCreateTemplate);
editTemplateFx.use(handleEditTemplate);
getEditingTemplateFx.use(handleFetchUserTemplate);
uploadTemplateFileFx.use(handleUploadTemplateFile);
uploadUserTemplateFileFx.use(handleUploadUserTemplateFile);
addTemplateToUserFx.use(handleAddTemplateToUser);
deleteCommonTemplateFx.use(handleDeleteCommonTemplate);

$templatesStore
    .on(getTemplatesFx.doneData, (state, data) => data)
    .reset(clearProfileEvent);

$templatePreviewStore.on(setPreviewTemplate, (_state, data: ICommonTemplate | null) => data);
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

$templateDraft
    .on(
        [
            createTemplateFx.doneData,
            editTemplateFx.doneData,
            getEditingTemplateFx.doneData,
            editUserTemplateFx.doneData,
        ],
        (state, data) => data,
    )
    .reset(clearTemplateDraft);

$replaceTemplateIdStore.on(setReplaceTemplateIdEvent, (state, data) => data);

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});
