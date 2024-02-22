import {
    $meetingNotesStore,
    $meetingNotesVisibilityStore,
    $doNotDisturbStore,
    setDoNotDisturbEvent,
    setMeetingNotesVisibilityEvent,
    getMeetingNotesSocketEvent,
    setMeetingNotesEvent,
    removeLocalMeetingNoteEvent,
} from './model';
import { resetRoomStores } from '../../../root';

$meetingNotesStore
    .on(setMeetingNotesEvent, (state, data) => [...state, ...(data || [])])
    .on(getMeetingNotesSocketEvent.doneData, (state, { meetingNotes }) => [
        ...state,
        ...(meetingNotes || []),
    ])
    .on(removeLocalMeetingNoteEvent, (state, data) =>
        state.filter(note => note.id !== data),
    )
    .reset(resetRoomStores);

$doNotDisturbStore.on(setDoNotDisturbEvent, (state, data) => data);

$meetingNotesVisibilityStore.on(setMeetingNotesVisibilityEvent, (state, { isVisible }) => ({
    ...state,
    isVisible: isVisible
}));
