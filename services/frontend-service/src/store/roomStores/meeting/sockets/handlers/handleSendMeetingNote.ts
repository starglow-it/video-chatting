import { setMeetingNotesEvent } from '../../meetingNotes/model';
import { MeetingNote } from '../../../../types';

export const handleSendMeetingNote = ({ meetingNotes }: { meetingNotes: MeetingNote[] }) => {
    setMeetingNotesEvent(meetingNotes);
};
