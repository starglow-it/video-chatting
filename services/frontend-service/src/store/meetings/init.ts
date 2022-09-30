import { $meetingsStore, createMeetingFx, deleteMeetingFx } from './model';
import { handleCreateMeeting } from './handlers/handleCreateMeeting';
import { handleDeleteMeeting } from './handlers/handleDeleteMeeting';

createMeetingFx.use(handleCreateMeeting);
deleteMeetingFx.use(handleDeleteMeeting);

$meetingsStore.on(createMeetingFx.doneData, (state, data) => ({
    ...state,
    currentMeeting: data.template,
}));
