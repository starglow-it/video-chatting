import { meetingDomain } from '../../domains';
import { MeetingNote } from '../../types';
import { createSocketEvent } from '../../socket/model';
import {
    EMIT_SEND_MEETING_NOTE_EVENT,
    EMIT_REMOVE_MEETING_NOTE_EVENT,
    EMIT_GET_MEETING_NOTES_EVENT,
} from '../../../const/socketEvents/emitters';

const initialMeetingsNotesState: MeetingNote[] = [];

export const $meetingNotesStore =
    meetingDomain.createStore<MeetingNote[]>(initialMeetingsNotesState);

export const setMeetingNotesEvent =
    meetingDomain.createEvent<MeetingNote[]>('setMeetingNotesEvent');
export const removeLocalMeetingNoteEvent = meetingDomain.createEvent<MeetingNote['id']>(
    'removeLocalMeetingNoteEvent',
);
export const resetMeetingNotesEvent = meetingDomain.createEvent('resetMeetingNotesEvent');

export const sendMeetingNoteSocketEvent = createSocketEvent<{ note: string }, void>(
    EMIT_SEND_MEETING_NOTE_EVENT,
);
export const removeMeetingNoteSocketEvent = createSocketEvent<{ noteId: MeetingNote['id'] }, void>(
    EMIT_REMOVE_MEETING_NOTE_EVENT,
);
export const getMeetingNotesSocketEvent = createSocketEvent<void, { meetingNotes: MeetingNote[] }>(
    EMIT_GET_MEETING_NOTES_EVENT,
);
