import { forward } from 'effector';

import {
    $discoveryTemplatesStore,
    $scheduleEventLinkStore,
    $scheduleTemplateIdStore,
    getUsersTemplatesFx,
    sendScheduleInviteFx,
    setScheduleEventLinkEvent,
    setScheduleTemplateIdEvent,
} from './model';
import { handleFetchUsersTemplates } from '../handlers/handleFetchUsersTemplates';
import { handleSendScheduleInvite } from '../handlers/handleSendScheduleInvite';
import {appDialogsApi} from "../../dialogs/init";
import {AppDialogsEnum} from "../../types";

getUsersTemplatesFx.use(handleFetchUsersTemplates);
sendScheduleInviteFx.use(handleSendScheduleInvite);

$discoveryTemplatesStore.on(getUsersTemplatesFx.doneData, (state, data) => ({
    ...state,
    ...data,
}));

forward({
    from: sendScheduleInviteFx.doneData,
    to: setScheduleEventLinkEvent,
});

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

    return data
});
