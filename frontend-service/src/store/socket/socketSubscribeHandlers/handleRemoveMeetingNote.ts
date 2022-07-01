import {removeLocalMeetingNoteEvent} from "../../meeting/meetingNotes/model";
import {MeetingNote} from "../../types";

export const handleRemoveMeetingNote = ({ meetingNoteId }: { meetingNoteId: MeetingNote["id"] }) => {
    removeLocalMeetingNoteEvent(meetingNoteId);
}