import { Expose, Transform, Type } from 'class-transformer';
import { CommonUserDTO } from './common-user.dto';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IMeetingNote } from '../../interfaces/meeting-note.interface';

export class MeetingNoteDTO implements IMeetingNote {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  content: string;

  @Type(() => CommonUserDTO)
  @Transform((data) => data.obj.user['_id']?.toString())
  user: ICommonUserDTO['id'];

  @Expose()
  createdAt: string;
}
