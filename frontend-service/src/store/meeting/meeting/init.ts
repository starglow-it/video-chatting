import { $meetingStore, resetMeetingStore, updateMeetingEvent } from './model';

$meetingStore
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetMeetingStore);
