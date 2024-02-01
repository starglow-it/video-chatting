import { combine, forward, sample } from 'effector';

import {
    $queryProfileTemplatesStore,
    $queryTemplatesStore,
    addTemplateToUserFx,
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
    loadmoreUserTemplates,
    purchaseTemplateFx,
    sendScheduleInviteFx,
    downloadIcsFileFx,
    setQueryProfileTemplatesEvent,
    setQueryTemplatesEvent,
    setScheduleEventLinkEvent,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
} from './model';

import { $profileStore } from '../profile/profile/model';

// handlers
import { handleFetchUsersTemplates } from './handlers/handleFetchUsersTemplates';
import { handleFetchUserTemplate } from './handlers/handleFetchUsersTemplate';
import { handleSendScheduleInvite } from './handlers/handleSendScheduleInvite';
import { handleDownloadIcsFile } from './handlers/handleDownloadIcsFile';
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
    getProfileTemplatesFx,
} from '../profile/profileTemplates/model';


getTemplatesFx.use(handleFetchTemplates);
getTemplateFx.use(handleFetchCommonTemplate);
getUsersTemplatesFx.use(handleFetchUsersTemplates);
getUserTemplateFx.use(handleFetchUserTemplate);
getUserTemplateByIdFx.use(handleGetUserTemplate);
purchaseTemplateFx.use(handlePurchaseTemplate);
sendScheduleInviteFx.use(handleSendScheduleInvite);
downloadIcsFileFx.use(handleDownloadIcsFile);
createTemplateFx.use(handleCreateTemplate);
editTemplateFx.use(handleEditTemplate);
getEditingTemplateFx.use(handleFetchUserTemplate);
uploadTemplateFileFx.use(handleUploadTemplateFile);
uploadUserTemplateFileFx.use(handleUploadUserTemplateFile);
addTemplateToUserFx.use(handleAddTemplateToUser);
deleteCommonTemplateFx.use(handleDeleteCommonTemplate);

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});

forward({
    from: downloadIcsFileFx.doneData,
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
        query: $queryProfileTemplatesStore,
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
    fn: ({ profile: { id }, query }) =>
        !id ? query : { ...query, userId: id },
    target: getTemplatesFx,
});

sample({
    clock: setQueryProfileTemplatesEvent,
    source: $queryProfileTemplatesStore,
    target: getProfileTemplatesFx,
});
