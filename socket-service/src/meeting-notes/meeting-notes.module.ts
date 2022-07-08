import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingNotesService } from './meeting-notes.service';
import { MeetingNote, MeetingNoteSchema } from '../schemas/meeting-note.schema';
import { MeetingNotesGateway } from './meeting-notes.gateway';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [
    UsersModule,
    MeetingsModule,
    MongooseModule.forFeature([
      {
        name: MeetingNote.name,
        schema: MeetingNoteSchema,
      },
    ]),
  ],
  providers: [MeetingNotesService, MeetingNotesGateway],
  exports: [MeetingNotesService],
})
export class MeetingNotesModule {}
