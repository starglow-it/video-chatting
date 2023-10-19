import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingNotesService } from './meeting-notes.service';
import {
  MeetingNote,
  MeetingNoteSchema,
} from '../../schemas/meeting-note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingNote.name,
        schema: MeetingNoteSchema,
      },
    ]),
  ],
  providers: [MeetingNotesService],
  exports: [MeetingNotesService],
})
export class MeetingNotesModule {}
