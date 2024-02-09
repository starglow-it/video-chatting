import { Expose, Transform, Type } from 'class-transformer';
import { CommonUserDTO } from './common-user.dto';
import { ICommonUser } from 'shared-types';
import { IMeetingNote } from '../../interfaces/meeting-note.interface';
import { MeetingNoteDocument } from '../../schemas/meeting-note.schema';
import { serializeInstance } from '../serialization';

export class MeetingNoteDTO implements IMeetingNote {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data.obj.user?.['_id']?.toString())
  user: ICommonUser['id'];

  @Expose()
  createdAt: string;
}

export const meetingNoteSerialization = (meetingNote: MeetingNoteDocument) =>
  serializeInstance(meetingNote, MeetingNoteDTO);
