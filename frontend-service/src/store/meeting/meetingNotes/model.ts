import { meetingDomain } from '../domain';
import {MeetingNote, Template} from "../../types";
import {createSocketEvent} from "../../socket";
import {SEND_MEETING_NOTE_EVENT} from "../const/emitSocketEvents";

const initialMeetingsNotesState: MeetingNote[] = [];

export const $meetingNotesStore = meetingDomain.store<MeetingNote[]>(initialMeetingsNotesState);

export const emitSendMeetingNoteEvent = meetingDomain.event<void>('emitSendMeetingNoteEvent');
export const setMeetingNoteEvent = meetingDomain.event<MeetingNote>('setMeetingNoteEvent');

export const sendMeetingNoteEvent = createSocketEvent(SEND_MEETING_NOTE_EVENT);

export const sendMeetingNoteResultFx = meetingDomain.effect<
    { note: MeetingNote["content"] },
    Template
    >('sendMeetingNoteResultFx');
