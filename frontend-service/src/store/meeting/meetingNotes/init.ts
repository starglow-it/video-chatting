import { combine, sample } from 'effector-next';

import {
    $meetingNotesStore,
    emitSendMeetingNoteEvent,
    sendMeetingNoteSocketEvent,
    getMeetingNotesSocketEvent,
    sendMeetingNoteResultFx,
    setMeetingNotesEvent,
    removeLocalMeetingNoteEvent,
    resetMeetingNotesEvent,
} from './model';

import { $meetingStore } from '../meeting/model';

import { $localUserStore } from '../../users/localUser/model';

sendMeetingNoteResultFx.use(async data => sendMeetingNoteSocketEvent(data));

sample({
    clock: emitSendMeetingNoteEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }, data) => ({ data: data.note }),
    target: sendMeetingNoteResultFx,
});

$meetingNotesStore
    .on(setMeetingNotesEvent, (state, data) => [...state, ...(data || [])])
    .on(getMeetingNotesSocketEvent.doneData, (state, { meetingNotes }) => [
        ...state,
        ...(meetingNotes || []),
    ])
    .on(removeLocalMeetingNoteEvent, (state, data) => state.filter(note => note.id !== data));

$meetingNotesStore.reset(resetMeetingNotesEvent);
