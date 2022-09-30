import { $meetingErrorStore, setMeetingErrorEvent } from './model';
import { resetRoomStores } from '../../../root';

$meetingErrorStore.on(setMeetingErrorEvent, (state, data) => data).reset(resetRoomStores);
