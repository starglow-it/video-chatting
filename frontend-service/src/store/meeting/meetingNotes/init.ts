import {
    $meetingNotesStore,
    getMeetingNotesSocketEvent,
    setMeetingNotesEvent,
    removeLocalMeetingNoteEvent,
    resetMeetingNotesEvent,
} from './model';

$meetingNotesStore
    .on(setMeetingNotesEvent, (state, data) => [...state, ...(data || [])])
    .on(getMeetingNotesSocketEvent.doneData, (state, { meetingNotes }) => [
        ...state,
        ...(meetingNotes || []),
    ])
    .on(removeLocalMeetingNoteEvent, (state, data) => state.filter(note => note.id !== data));

$meetingNotesStore.reset(resetMeetingNotesEvent);
