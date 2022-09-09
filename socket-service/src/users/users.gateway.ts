import { Global, Logger } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
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
import { CoreService } from '../core/core.service';
import { MeetingTimeService } from '../modules/meeting-time/meeting-time.service';
import { TasksService } from '../tasks/tasks.service';

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
import { CommonMeetingDTO } from '../dtos/response/common-meeting.dto';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';
import { getTimeoutTimestamp } from '../utils/getTimeoutTimestamp';

import { TimeoutTypesEnum } from '../types/timeoutTypes.enum';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class UsersGateway extends BaseGateway {
  private readonly logger = new Logger(UsersGateway.name);

  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private coreService: CoreService,
    private taskService: TasksService,
    private meetingHostTimeService: MeetingTimeService,
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

      const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
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

  @SubscribeMessage(SubscribeEvents.CHANGE_HOST)
  async changeHost(@MessageBody() message: { userId: string }) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(message.userId, session);

      if (!user) {
        this.logger.error({
          message: '[changeHost]: no user found',
          ctx: {
            socketId: message.userId,
          },
        });

        return;
      }

      const profileUser = await this.coreService.findUserById({
        userId: user.profileId,
      });

      await user.populate([{ path: 'meeting', populate: 'hostUserId' }]);

      const meeting = await this.meetingsService.findByIdAndUpdate(
        user.meeting._id,
        {
          hostUserId: message.userId,
        },
        session,
      );

      if (
        profileUser &&
        !profileUser?.maxMeetingTime &&
        profileUser?.subscriptionPlanKey !== 'Business'
      ) {
        return {
          success: false,
          message: 'meeting.userHasNoTimeLeft',
        };
      }

      if (user?.meeting?.hostUserId?._id) {
        const prevHostUser = await this.usersService.findById(
          user?.meeting?.hostUserId?._id,
          session,
        );

        const prevProfileHostUser = await this.coreService.findUserById({
          userId: prevHostUser.profileId,
        });

        if (prevProfileHostUser.subscriptionPlanKey !== 'Business') {
          const hostTimeData = await this.meetingHostTimeService.update({
            query: {
              host: prevHostUser.id,
              meeting: meeting.id,
              endAt: null,
            },
            data: {
              endAt: Date.now(),
            },
          });

          const newTime =
            profileUser.maxMeetingTime -
            (hostTimeData.endAt - hostTimeData.startAt);

          await this.coreService.updateUser({
            query: { _id: profileUser.id },
            data: {
              maxMeetingTime: newTime < 0 ? 0 : newTime,
            },
          });

          if (prevHostUser?.socketId) {
            this.emitToSocketId(prevHostUser?.socketId, 'meeting:timeLimit');
          }
        }
      }

      if (profileUser?.subscriptionPlanKey !== 'Business') {
        await this.meetingHostTimeService.create({
          data: {
            host: user.id,
            meeting: meeting.id,
          },
        });

        this.taskService.deleteTimeout({
          name: `meeting:timeLimit:${meeting.id}`,
        });

        const finishTime = meeting.endsAt - Date.now();

        const timeLimitNotificationTimeout = getTimeoutTimestamp({
          value: 20,
          type: TimeoutTypesEnum.Minutes,
        });

        if (finishTime > timeLimitNotificationTimeout) {
          this.taskService.addTimeout({
            name: `meeting:timeLimit:${meeting.id}`,
            ts: finishTime - timeLimitNotificationTimeout,
            callback: async () => {
              const hostTimeData = await this.meetingHostTimeService.update({
                query: {
                  host: user.id,
                  meeting: meeting.id,
                  endAt: null,
                },
                data: {
                  endAt: Date.now(),
                },
              });

              const newTime =
                profileUser.maxMeetingTime -
                (hostTimeData.endAt - hostTimeData.startAt);

              await this.coreService.updateUser({
                query: { _id: profileUser.id },
                data: {
                  maxMeetingTime: newTime < 0 ? 0 : newTime,
                },
              });

              if (user?.socketId) {
                this.emitToSocketId(user?.socketId, 'meeting:timeLimit');
              }
            },
          });
        }
      }

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
        meeting: plainMeeting,
      });
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
          const updateData = {
            sharingUserId: user.meeting.sharingUserId,
            hostUserId: user.meeting.hostUserId,
          };

          if (user.meeting.sharingUserId === user.meetingUserId) {
            updateData.sharingUserId = null;
          }

          if (user.meeting.hostUserId === user.id) {
            updateData.hostUserId = null;
          }

          const meeting = await this.meetingsService.updateMeetingById(
            user.meeting._id,
            updateData,
            session,
          );

          const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
            meeting: plainMeeting,
          });

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
