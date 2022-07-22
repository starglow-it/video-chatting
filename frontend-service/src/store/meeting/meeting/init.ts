import { $meetingStore, resetMeetingStore, updateMeetingEvent, $meetingConnectedStore, setMeetingConnectedEvent} from './model';

$meetingStore
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetMeetingStore);

$meetingConnectedStore.on(setMeetingConnectedEvent, (state, data) => data);
