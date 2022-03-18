import { IsString } from 'class-validator';
import { IRemoveMeetingNote } from '../../../interfaces/remove-meeting-note.interface';

export class RemoveMeetingNoteRequestDTO implements IRemoveMeetingNote {
  @IsString()
  noteId: string;
}
