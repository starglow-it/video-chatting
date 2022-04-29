import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Global } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';
import { plainToClass } from 'class-transformer';

import {
  GET_MEETING_NOTES_EVENT,
  REMOVE_MEETING_NOTE_EVENT,
  SEND_MEETING_NOTE_EVENT,
} from '../const/socketEvents.const';
import { BaseGateway } from '../gateway/base.gateway';

import { UsersService } from '../users/users.service';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { SendMeetingNoteRequestDTO } from '../dtos/requests/notes/send-meeting-note.dto';
import { MeetingNotesService } from './meeting-notes.service';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingNoteDTO } from '../dtos/response/meeting-note.dto';
import {
  REMOVE_MEETING_NOTE,
  SEND_MEETING_NOTE,
} from '../const/emitSocketEvents.const';
import { RemoveMeetingNoteRequestDTO } from '../dtos/requests/notes/remove-meeting-note.dto';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class MeetingNotesGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private meetingNotesService: MeetingNotesService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(SEND_MEETING_NOTE_EVENT)
  async sendMeetingNote(
    @MessageBody() message: SendMeetingNoteRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );

      await user.populate('meeting');

      const [newNote] = await this.meetingNotesService.create(
        {
          user: user._id,
          meeting: user.meeting._id,
          content: message.note,
        },
        session,
      );

      const meetingNote = plainToClass(MeetingNoteDTO, newNote, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${user.meeting._id}`, SEND_MEETING_NOTE, {
        meetingNotes: [meetingNote],
      });
    });
  }

  @SubscribeMessage(REMOVE_MEETING_NOTE_EVENT)
  async removeMeetingNote(
    @MessageBody() message: RemoveMeetingNoteRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );

      await user.populate('meeting');

      await this.meetingNotesService.deleteOne(
        { _id: message.noteId },
        session,
      );

      this.emitToRoom(`meeting:${user.meeting._id}`, REMOVE_MEETING_NOTE, {
        meetingNoteId: message.noteId,
      });
    });
  }

  @SubscribeMessage(GET_MEETING_NOTES_EVENT)
  async getMeetingNotes(@ConnectedSocket() socket: Socket) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );

      await user.populate('meeting');

      const meetingNotes = await this.meetingNotesService.findMany(
        { meeting: user.meeting._id },
        session,
      );

      const plainMeetingNotes = plainToClass(MeetingNoteDTO, meetingNotes, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      return {
        success: true,
        result: {
          meetingNotes: plainMeetingNotes,
        },
      };
    });
  }
}
