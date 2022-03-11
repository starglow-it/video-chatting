import {combine, sample} from "effector-next";

import {
    $meetingNotesStore,
    emitSendMeetingNoteEvent,
    sendMeetingNoteEvent,
    sendMeetingNoteResultFx,
    setMeetingNoteEvent
} from "./model";

import {$meetingStore} from "../meeting";

import {$localUserStore} from "../../users";

sendMeetingNoteResultFx.use(async data => sendMeetingNoteEvent(data));

sample({
    clock: emitSendMeetingNoteEvent,
    source: combine({ meeting: $meetingStore, user: $localUserStore }),
    fn: ({ meeting, user }, data) => ({ meetingId: meeting?.id, userId: user.id, data: data.note }),
    target: sendMeetingNoteResultFx,
});

$meetingNotesStore.on(setMeetingNoteEvent, (state, data) => ([...state, data]));

