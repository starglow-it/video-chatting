import {
    $meetingStore,
    updateMeetingEvent,
    $meetingConnectedStore,
    setMeetingConnectedEvent,
} from './model';
import { resetRoomStores } from '../../../root';

$meetingStore
    .on(updateMeetingEvent, (state, { meeting }) => ({ ...state, ...meeting }))
    .reset(resetRoomStores);

$meetingConnectedStore.on(setMeetingConnectedEvent, (state, data) => data).reset(resetRoomStores);
