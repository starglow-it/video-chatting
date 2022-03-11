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
import {plainToClass} from "class-transformer";

import {
  SEND_MEETING_NOTE_EVENT,
} from '../const/socketEvents.const';
import { BaseGateway } from '../gateway/base.gateway';

import { UsersService } from '../users/users.service';
import { withTransaction } from '../helpers/mongo/withTransaction';
import {SendMeetingNoteRequestDTO} from "../dtos/requests/notes/send-meeting-note.dto";
import {MeetingNotesService} from "./meeting-notes.service";
import {MeetingsService} from "../meetings/meetings.service";
import {MeetingNoteDTO} from "../dtos/response/meeting-note.dto";
import {SEND_MEETING_NOTE} from "../const/emitSocketEvents.const";

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

      const [newNote] = await this.meetingNotesService.create({
        user: user._id,
        content: message.data
      }, session);

      const meetingNote = plainToClass(MeetingNoteDTO, newNote, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${user.meeting._id}`, SEND_MEETING_NOTE, {
        meetingNote,
      });
    });
  }
}
