import { IsString ,MaxLength } from 'class-validator';
import { ISendMeetingNote } from '../../../interfaces/send-meeting-note.interface';

export class SendMeetingNoteRequestDTO implements ISendMeetingNote {
  @IsString()
  @MaxLength(500)
  note: string;
}
