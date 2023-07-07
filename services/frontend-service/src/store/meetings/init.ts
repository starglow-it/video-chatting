import {
    $meetingsStore,
    checkCustomLinkFx,
    createMeetingFx,
    deleteMeetingFx,
} from './model';
import { handleCreateMeeting } from './handlers/handleCreateMeeting';
import { handleDeleteMeeting } from './handlers/handleDeleteMeeting';
import { handleCheckCustomLink } from './handlers/handleCheckCustomLink';

createMeetingFx.use(handleCreateMeeting);
deleteMeetingFx.use(handleDeleteMeeting);
checkCustomLinkFx.use(handleCheckCustomLink);

$meetingsStore.on(createMeetingFx.doneData, (state, data) => ({
    ...state,
    currentMeeting: data.template,
}));
