import {
    $meetingNotesStore,
    $meetingNotesVisibilityStore,
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

$meetingNotesVisibilityStore.on(setMeetingNotesVisibilityEvent, (state, { isVisible }) => ({
    ...state,
    isVisible: isVisible
}));
