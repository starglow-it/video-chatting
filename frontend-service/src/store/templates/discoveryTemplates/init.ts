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
import { handleFetchUsersTemplates } from '../handlers';
import { handleSendScheduleInvite } from '../handlers/handleSendScheduleInvite';

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
$scheduleEventLinkStore.on(setScheduleEventLinkEvent, (state, data) => data);
