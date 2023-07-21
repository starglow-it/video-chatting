import { meetingDomain } from '../../../domains';
import { MeetingNote } from '../../../types';
import { MeetingSocketEmitters } from '../../../../const/socketEvents/emitters';
import { createMeetingSocketEvent } from '../../meetingSocket/model';

const initialMeetingsNotesState: MeetingNote[] = [];

export const $meetingNotesStore = meetingDomain.createStore<MeetingNote[]>(
    initialMeetingsNotesState,
);

export const setMeetingNotesEvent = meetingDomain.createEvent<MeetingNote[]>(
    'setMeetingNotesEvent',
);
export const removeLocalMeetingNoteEvent = meetingDomain.createEvent<
    MeetingNote['id']
>('removeLocalMeetingNoteEvent');

export const sendMeetingNoteSocketEvent = createMeetingSocketEvent<
    { note: string },
    void
>(MeetingSocketEmitters.SendMeetingNote);
export const removeMeetingNoteSocketEvent = createMeetingSocketEvent<
    { noteId: MeetingNote['id'] },
    void
>(MeetingSocketEmitters.RemoveMeetingNote);
export const getMeetingNotesSocketEvent = createMeetingSocketEvent<
    void,
    { meetingNotes: MeetingNote[] }
>(MeetingSocketEmitters.GetMeetingNotes);
