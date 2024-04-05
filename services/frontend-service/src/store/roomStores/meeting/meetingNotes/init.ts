import {
    $meetingNotesStore,
    $meetingNotesVisibilityStore,
    $doNotDisturbStore,
    $isAITranscriptEnabledStore,
    setDoNotDisturbEvent,
    setMeetingNotesVisibilityEvent,
    getMeetingNotesSocketEvent,
    setMeetingNotesEvent,
    removeLocalMeetingNoteEvent,
    setAITranscriptEvent
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
$isAITranscriptEnabledStore.on(setAITranscriptEvent, (state, data) => data);

$meetingNotesVisibilityStore.on(setMeetingNotesVisibilityEvent, (state, { isVisible }) => ({
    ...state,
    isVisible: isVisible
}));
