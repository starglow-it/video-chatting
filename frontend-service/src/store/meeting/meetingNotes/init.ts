import {
    $meetingNotesStore,
    setMeetingNotesEvent,
    removeLocalMeetingNoteEvent,
    getMeetingNotesSocketEvent,
    resetMeetingNotesEvent
} from "./model";

$meetingNotesStore
    .on(setMeetingNotesEvent, (state, data) => ([...state, ...data]))
    .on(getMeetingNotesSocketEvent.doneData, (state, data) => ([...state, ...data]))
    .on(removeLocalMeetingNoteEvent, (state, data) => state.filter(note => note.id !== data));

$meetingNotesStore.reset(resetMeetingNotesEvent);


