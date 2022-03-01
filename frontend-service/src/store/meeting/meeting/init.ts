import { $meetingStore, resetMeetingStore, setMeetingEvent, updateMeetingEvent } from './model';

$meetingStore
    .on(setMeetingEvent, (state, { meeting }) => meeting)
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetMeetingStore);
