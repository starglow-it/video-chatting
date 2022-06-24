import { meetingDomain } from '../domain';
import { MeetingNote } from '../../types';
import { createSocketEvent } from '../../socket/model';
import {
    GET_MEETING_NOTES_EVENT,
    REMOVE_MEETING_NOTE_EVENT,
    SEND_MEETING_NOTE_EVENT
} from "../../../const/socketEvents/emitters";

const initialMeetingsNotesState: MeetingNote[] = [];

export const $meetingNotesStore = meetingDomain.store<MeetingNote[]>(initialMeetingsNotesState);

export const emitSendMeetingNoteEvent = meetingDomain.event<void>('emitSendMeetingNoteEvent');
export const setMeetingNotesEvent = meetingDomain.event<MeetingNote[]>('setMeetingNotesEvent');
export const removeLocalMeetingNoteEvent = meetingDomain.event<MeetingNote['id']>(
    'removeLocalMeetingNoteEvent',
);
export const resetMeetingNotesEvent = meetingDomain.event('resetMeetingNotesEvent');

export const sendMeetingNoteSocketEvent = createSocketEvent(SEND_MEETING_NOTE_EVENT);
export const removeMeetingNoteSocketEvent = createSocketEvent(REMOVE_MEETING_NOTE_EVENT);
export const getMeetingNotesSocketEvent = createSocketEvent(GET_MEETING_NOTES_EVENT);

export const sendMeetingNoteResultFx = meetingDomain.effect<{ note: MeetingNote['content'] }, void>(
    'sendMeetingNoteResultFx',
);
