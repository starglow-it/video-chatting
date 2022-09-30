import { setMeetingNotesEvent } from '../../meetingNotes/model';
import { MeetingNote } from '../../../../types';

export const handleGetMeetingNotes = ({ meetingNotes }: { meetingNotes: MeetingNote[] }) => {
    setMeetingNotesEvent(meetingNotes);
};
