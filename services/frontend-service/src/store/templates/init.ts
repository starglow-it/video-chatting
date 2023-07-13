import { combine, forward, sample, split } from 'effector';

import { ICommonTemplate } from 'shared-types';
import {
    $discoveryTemplatesStore,
    $isUploadTemplateBackgroundInProgress,
    $modeTemplateStore,
    $queryProfileTemplatesStore,
    $queryTemplatesStore,
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
    loadmoreCommonTemplates,
    loadmoreMetaTemplates,
    loadmoreUserTemplates,
    purchaseTemplateFx,
    sendScheduleInviteFx,
    setPreviewTemplate,
    setQueryProfileTemplatesEvent,
    setQueryTemplatesEvent,
    setReplaceTemplateIdEvent,
    setScheduleEventLinkEvent,
    setScheduleTemplateIdEvent,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
} from './model';

import { appDialogsApi } from '../dialogs/init';
import { $profileStore, clearProfileEvent } from '../profile/profile/model';

// types
import { AppDialogsEnum } from '../types';

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
import {
    editUserTemplateFx,
    getProfileTemplatesFx,
} from '../profile/profileTemplates/model';

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
    .on(getTemplatesFx.doneData, (state, data) => ({
        ...data,
        list: data.isReset
            ? data.list
            : [
                  ...state.list,
                  ...data.list.filter(item => !item.isAcceptNoLogin),
              ],
    }))
    .reset(clearProfileEvent);

$templatePreviewStore.on(
    setPreviewTemplate,
    (_state, data: ICommonTemplate | null) => data,
);
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

$isUploadTemplateBackgroundInProgress.reset(clearTemplateDraft);

$queryTemplatesStore
    .on(setQueryTemplatesEvent, (state, data) => ({
        ...state,
        ...data,
    }))
    .on(getTemplatesFx.doneData, (state, data) => ({
        ...state,
        skip: data.skip,
    }))
    .reset(setQueryProfileTemplatesEvent);

$queryProfileTemplatesStore
    .on(setQueryProfileTemplatesEvent, (state, data) => ({ ...state, ...data }))
    .on(getProfileTemplatesFx.doneData, (state, data) => ({
        ...state,
        skip: data?.skip || 0,
    }))
    .reset(setQueryTemplatesEvent);

$modeTemplateStore
    .on(setQueryTemplatesEvent, () => 'common')
    .on(setQueryProfileTemplatesEvent, () => 'private');

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});

sample({
    clock: loadmoreCommonTemplates,
    source: $queryTemplatesStore,
    fn: query => ({ ...query, skip: (query.skip || 0) + 1 }),
    target: getTemplatesFx,
});

sample({
    clock: loadmoreUserTemplates,
    source: combine({
        profile: $profileStore,
        query: $queryTemplatesStore,
    }),
    fn: ({ profile: { id }, query }) => ({
        ...query,
        skip: (query.skip || 0) + 1,
        userId: id,
    }),
    target: getProfileTemplatesFx,
});

sample({
    clock: setQueryTemplatesEvent,
    source: combine({
        profile: $profileStore,
        query: $queryTemplatesStore,
    }),
    fn: ({ profile: { id }, query }) => (!id ? query : { ...query, userId: id }),
    target: getTemplatesFx,
});

sample({
    clock: setQueryProfileTemplatesEvent,
    source: $queryTemplatesStore,
    target: getProfileTemplatesFx,
});
