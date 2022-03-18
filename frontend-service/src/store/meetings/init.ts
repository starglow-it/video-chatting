import {$meetingsStore, createMeetingFx} from "./model";
import {handleCreateMeeting} from "./handlers/handleCreateMeeting";

createMeetingFx.use(handleCreateMeeting);

$meetingsStore.on(createMeetingFx.doneData, (state, data) => ({
    ...state,
    currentMeeting: data.meeting,
}));