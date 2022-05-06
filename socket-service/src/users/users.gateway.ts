import { Global } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';

// gateways
import { BaseGateway } from '../gateway/base.gateway';

// types
import { ResponseSumType } from '@shared/response/common.response';

// services
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from './users.service';

// events
import SubscribeEvents from '../const/socketEvents.const';
import EmitEvents, {
  KICK_USER,
  REMOVE_USERS,
  UPDATE_MEETING,
} from '../const/emitSocketEvents.const';

// dtos
import { UpdateUserRequestDTO } from '../dtos/requests/users/update-user.dto';
import { CommonUserDTO } from '../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../dtos/requests/users/remove-user.dto';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';
import { CommonMeetingDTO } from '../dtos/response/common-meeting.dto';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class UsersGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(SubscribeEvents.UPDATE_USER)
  async updateUser(
    @MessageBody() message: UpdateUserRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<ResponseSumType<{ user: CommonUserDTO }>> {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOneAndUpdate(
        { socketId: socket.id },
        message,
        session,
      );

      const meeting = await this.meetingsService.findById(
          user.meeting._id,
          session,
      );

      await meeting.populate('users');

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${user.meeting}`, EmitEvents.UPDATE_USERS, {
        users: plainUsers,
      });

      return {
        success: true,
        result: {
          user: plainUser,
        },
      };
    });
  }

  @SubscribeMessage(SubscribeEvents.REMOVE_USER)
  async removeUser(
    @MessageBody() message: RemoveUserRequestDTO,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(message.id, session);

      if (user) {
        await user.populate('meeting');

        if (user.meeting) {
          if (user.meeting.sharingUserId === user.meetingUserId) {
            const meeting = await this.meetingsService.updateMeetingById(
              user.meeting._id,
              { sharingUserId: null },
              session,
            );

            const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            });

            this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
              meeting: plainMeeting,
            });
          }
          this.emitToRoom(`meeting:${user.meeting._id}`, REMOVE_USERS, {
            users: [user._id],
          });

          this.emitToSocketId(user.socketId, KICK_USER);
        }

        await this.usersService.deleteUser({ id: message.id }, session);
      }
    });
  }
}
