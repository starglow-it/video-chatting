import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';

import { BaseGateway } from '../../gateway/base.gateway';

import { UsersService } from '../users/users.service';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { SendMeetingNoteRequestDTO } from '../../dtos/requests/notes/send-meeting-note.dto';
import { MeetingNotesService } from './meeting-notes.service';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingNoteDTO } from '../../dtos/response/meeting-note.dto';
import { RemoveMeetingNoteRequestDTO } from '../../dtos/requests/notes/remove-meeting-note.dto';
import { plainToInstance } from 'class-transformer';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: "*",
  }
})
export class MeetingNotesGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private meetingNotesService: MeetingNotesService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnSendMeetingNote)
  async sendMeetingNote(
    @MessageBody() message: SendMeetingNoteRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      const [newNote] = await this.meetingNotesService.create(
        {
          user: user._id,
          meeting: user.meeting._id,
          content: message.note,
        },
        session,
      );

      const meetingNote = plainToInstance(MeetingNoteDTO, newNote, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${user.meeting._id}`,
        MeetingEmitEvents.SendMeetingNote,
        {
          meetingNotes: [meetingNote],
        },
      );

      return {
        success: true,
      };
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnRemoveMeetingMote)
  async removeMeetingNote(
    @MessageBody() message: RemoveMeetingNoteRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      await this.meetingNotesService.deleteOne(
        { _id: message.noteId },
        session,
      );

      this.emitToRoom(
        `meeting:${user.meeting._id}`,
        MeetingEmitEvents.RemoveMeetingNote,
        {
          meetingNoteId: message.noteId,
        },
      );
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnGetMeetingNotes)
  async getMeetingNotes(@ConnectedSocket() socket: Socket) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      if (!user) return;

      const meetingNotes = await this.meetingNotesService.findMany(
        { meeting: user.meeting._id },
        session,
        'user',
      );

      const plainMeetingNotes = plainToInstance(MeetingNoteDTO, meetingNotes, {
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
