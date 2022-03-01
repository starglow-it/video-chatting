import { $meetingErrorStore, setMeetingErrorEvent } from './model';

$meetingErrorStore.on(setMeetingErrorEvent, (state, data) => data);
