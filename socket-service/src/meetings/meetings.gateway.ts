import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Global, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Socket } from 'socket.io';
import { plainToClass } from 'class-transformer';

import {
  ANSWER_ACCESS_REQUEST,
  CANCEL_ACCESS_REQUEST,
  END_MEETING,
  JOIN_WAITING_ROOM,
  LEAVE_MEETING,
  SEND_ACCESS_REQUEST,
  START_MEETING,
} from '../const/socketEvents.const';
import {
  MEETING_FINISHED,
  PLAY_SOUND,
  RECEIVE_ACCESS_REQUEST,
  REMOVE_USERS,
  SEND_MEETING_ERROR,
  UPDATE_MEETING,
  UPDATE_USER,
} from '../const/emitSocketEvents.const';

import { BaseGateway } from '../gateway/base.gateway';

import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';

import { ResponseSumType } from '@shared/response/common.response';

import { StartMeetingRequestDTO } from '../dtos/requests/start-meeting.dto';
import { JoinMeetingRequestDTO } from '../dtos/requests/join-meeting.dto';
import { CommonUserDTO } from '../dtos/response/common-user.dto';
import { CommonMeetingDTO } from '../dtos/response/common-meeting.dto';
import { EnterMeetingRequestDTO } from '../dtos/requests/enter-meeting.dto';
import { MeetingAccessAnswerRequestDTO } from '../dtos/requests/answer-access-meeting.dto';
import { LeaveMeetingRequestDTO } from '../dtos/requests/leave-meeting.dto';
import { EndMeetingRequestDTO } from '../dtos/requests/end-meeting.dto';
import { UpdateMeetingRequestDTO } from '../dtos/requests/update-meeting.dto';

import { AccessStatusEnum } from '../types/accessStatus.enum';
import { TimeoutTypesEnum } from '../types/timeoutTypes.enum';
import { MeetingSounds } from '@shared/types/meeting-sounds.enum';

import { getRandomNumber } from '../utils/getRandomNumber';
import { getTimeoutTimestamp } from '../utils/getTimeoutTimestamp';
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class MeetingsGateway
  extends BaseGateway
  implements OnGatewayDisconnect
{
  private readonly logger = new Logger(MeetingsGateway.name);
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private taskService: TasksService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  async handleDisconnect(client: any) {
    await withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: client.id },
        session,
      );

      if (user) {
        await user.populate('meeting');

        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const meeting = await this.meetingsService.findByIdAndUpdate(
          user?.meeting?._id,
          {
            sharingUserId:
              user?.meeting.sharingUserId === user.meetingUserId
                ? null
                : user?.meeting.sharingUserId,
          },
          session,
        );

        await this.usersService.deleteUser({ socketId: client.id }, session);

        if (meeting) {
          await meeting.populate(['owner', 'users']);

          const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          if (user?.accessStatus === AccessStatusEnum.InMeeting) {
            this.emitToRoom(`meeting:${user.meeting._id}`, REMOVE_USERS, {
              users: [plainUser.id],
            });
          }

          const isOwner = plainMeeting.owner === plainUser.id;

          if (
            !isOwner &&
            meeting?.owner?.socketId &&
            plainUser?.accessStatus === AccessStatusEnum.RequestSent
          ) {
            this.emitToSocketId(meeting?.owner?.socketId, REMOVE_USERS, {
              users: [plainUser.id],
            });
          }

          if (isOwner && plainUser?.accessStatus !== AccessStatusEnum.Waiting) {
            const endTimestamp = getTimeoutTimestamp({
              type: TimeoutTypesEnum.Minutes,
              value: 15,
            });

            if (meeting.endsAt - Date.now() > endTimestamp) {
              this.taskService.deleteTimeout({ name: `meeting:finish:${plainMeeting.id}` });

              this.taskService.addTimeout({
                name: `meeting:finish:${plainMeeting.id}`,
                ts: endTimestamp,
                callback: this.endMeeting.bind(this, {
                  meetingId: meeting._id,
                  client,
                }),
              });
            }
          }

          const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          this.emitToRoom(`waitingRoom:${meeting.instanceId}`, UPDATE_MEETING, {
            meeting: plainMeeting,
            users: plainUsers,
          });
        }
      }
    });
  }

  @SubscribeMessage(JOIN_WAITING_ROOM)
  async handleJoinWaitingRoom(
    @MessageBody() message: JoinMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user: CommonUserDTO;
      meeting: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    return withTransaction(this.connection, async (session) => {
      // TODO: fetch main instance
      this.logger.log(`User joined meeting ${message.instanceId}`);

      socket.join(`waitingRoom:${message.instanceId}`);

      let meeting = await this.meetingsService.findOne(
        {
          instanceId: message.instanceId,
        },
        session,
      );

      if (message.isOwner && !meeting) {
        meeting = await this.meetingsService.createMeeting(
          {
            isMonetizationEnabled: false,
            mode: 'together',
            ownerProfileId: message.profileId,
            instanceId: message.instanceId,
            maxParticipants: message.maxParticipants,
          },
          session,
        );
      }

      if (!meeting) {
        return {
          success: false,
          message: 'meeting.notFound',
        };
      }

      const user = await this.usersService.createUser(
        {
          profileId: message.profileId,
          socketId: socket.id,
          username: message?.profileUserName,
          profileAvatar: message?.profileAvatar,
          isGenerated: !Boolean(message.profileId),
          meetingUserId: getRandomNumber(10000),
          accessStatus: message.accessStatus,
        },
        session,
      );

      if (message.isOwner) {
        meeting = await this.meetingsService.updateMeetingById(
          meeting._id,
          { owner: user._id },
          session,
        );
      }

      user.meeting = meeting._id;

      await user.save();

      meeting = await this.meetingsService.addUserToMeeting(
        {
          meetingId: meeting._id,
          userId: user.id,
        },
        session,
      );

      await meeting.populate('users');

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${plainMeeting.id}`, UPDATE_MEETING, {
        meeting: plainMeeting,
        users: plainUsers,
      });

      return {
        success: true,
        result: {
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        },
      };
    });
  }

  @SubscribeMessage(START_MEETING)
  async startMeeting(
    @MessageBody() message: StartMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    return withTransaction(this.connection, async (session) => {
      this.taskService.deleteTimeout({
        name: `meeting:finish:${message.meetingId}`,
      });

      const user = await this.usersService.findOneAndUpdate(
        { socketId: socket.id },
        {
          accessStatus: AccessStatusEnum.InMeeting,
          username: message.user.username,
        },
        session,
      );

      const meeting = await this.meetingsService.findById(
        message.meetingId,
        session,
      );

      await meeting.populate('users');

      if (!meeting.endsAt) {
        const endsAtTimeout = getTimeoutTimestamp({
          type: TimeoutTypesEnum.Minutes,
          value: 90,
        });

        meeting.endsAt = Date.now() + endsAtTimeout;

        await meeting.save();

        this.taskService.addTimeout({
          name: `meeting:finish:${message.meetingId}`,
          ts: endsAtTimeout,
          callback: this.endMeeting.bind(this, {
            meetingId: meeting._id,
          }),
        });
      } else {
        this.taskService.addTimeout({
          name: `meeting:finish:${message.meetingId}`,
          ts: meeting.endsAt - Date.now(),
          callback: this.endMeeting.bind(this, {
            meetingId: meeting._id,
          }),
        });
      }

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      socket.join(`meeting:${message.meetingId}`);

      this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
        meeting: plainMeeting,
        users: plainUsers,
      });

      return {
        success: true,
        result: {
          user: plainUser,
          meeting: plainMeeting,
          users: plainUsers,
        },
      };
    });
  }

  @SubscribeMessage(SEND_ACCESS_REQUEST)
  async sendEnterMeetingRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        await meeting.populate(['owner', 'users']);

        const user = await this.usersService.findOneAndUpdate(
          { socketId: socket.id },
          {
            accessStatus: AccessStatusEnum.RequestSent,
            username: message.user.username,
          },
          session,
        );

        const activeParticipants = await this.usersService.countMany({
          meeting: meeting._id,
          accessStatus: AccessStatusEnum.InMeeting,
        });

        if (activeParticipants === meeting.maxParticipants) {
          return {
            success: false,
            message: 'meeting.maxParticipantsNumber',
          };
        }

        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        if (
          meeting?.owner?.socketId &&
          meeting?.owner?.accessStatus === AccessStatusEnum.InMeeting
        ) {
          this.emitToSocketId(
            meeting?.owner?.socketId,
            RECEIVE_ACCESS_REQUEST,
            {
              user: plainUser,
            },
          );

          this.emitToSocketId(meeting?.owner?.socketId, PLAY_SOUND, {
            soundType: MeetingSounds.NewAttendee,
          });
        }

        return {
          success: true,
          result: {
            user: plainUser,
            meeting: plainMeeting,
            users: plainUsers,
          },
        };
      },
    );
  }

  @SubscribeMessage(CANCEL_ACCESS_REQUEST)
  async cancelAccessRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users?: CommonUserDTO[];
    }>
  > {
    return withTransaction(this.connection, async (session) => {
      const meeting = await this.meetingsService.findById(
        message.meetingId,
        session,
      );

      const user = await this.usersService.findOneAndUpdate(
        { socketId: socket.id },
        { accessStatus: AccessStatusEnum.Waiting },
        session,
      );

      await meeting.populate(['owner', 'users']);

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
        meeting: plainMeeting,
        users: plainUsers,
      });

      this.emitToSocketId(user.socketId, UPDATE_USER, {
        user: plainUser,
      });

      return {
        success: true,
        result: {
          meeting: plainMeeting,
          users: plainUsers,
        },
      };
    });
  }

  @SubscribeMessage(ANSWER_ACCESS_REQUEST)
  async sendAccessAnswer(
    @MessageBody() message: MeetingAccessAnswerRequestDTO,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(this.connection, async (session) => {
      const meeting = await this.meetingsService.findById(
        message.meetingId,
        session,
      );

      if (message.isUserAccepted) {
        const user = await this.usersService.findById(message.userId, session);

        if (!user) return;

        const activeParticipants = await this.usersService.countMany({
          meeting: meeting._id,
          accessStatus: AccessStatusEnum.InMeeting,
        });

        if (activeParticipants === meeting.maxParticipants) {
          this.emitToSocketId(user.socketId, SEND_MEETING_ERROR, {
            message: 'meeting.maxParticipantsNumber',
          });

          return {
            success: false,
            message: 'meeting.maxParticipantsNumber',
          };
        }

        const updatedUser = await this.usersService.findOneAndUpdate(
          {
            _id: message.userId,
            accessStatus: { $eq: AccessStatusEnum.RequestSent },
          },
          { accessStatus: AccessStatusEnum.InMeeting },
          session,
        );

        const userSocket = await this.getSocket(
          `waitingRoom:${meeting.instanceId}`,
          user.socketId,
        );

        const plainUser = plainToClass(CommonUserDTO, updatedUser, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        userSocket.join(`meeting:${meeting._id}`);

        this.emitToSocketId(user.socketId, UPDATE_USER, {
          user: plainUser,
        });
      } else if (!message.isUserAccepted) {
        const user = await this.usersService.findByIdAndUpdate(
          message.userId,
          {
            accessStatus: AccessStatusEnum.Rejected,
          },
          session,
        );

        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        this.emitToSocketId(user.socketId, RECEIVE_ACCESS_REQUEST, {
          user: plainUser,
        });

        this.emitToSocketId(user.socketId, SEND_MEETING_ERROR, {
          message: 'meeting.requestDenied',
        });
      }

      await meeting.populate(['owner', 'users']);

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToClass(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(`meeting:${meeting._id}`, UPDATE_MEETING, {
        meeting: plainMeeting,
        users: plainUsers,
      });

      this.emitToRoom(`waitingRoom:${meeting.instanceId}`, UPDATE_MEETING, {
        meeting: plainMeeting,
        users: plainUsers,
      });
    });
  }

  @SubscribeMessage(END_MEETING)
  async endMeeting(@MessageBody() message: EndMeetingRequestDTO) {
    await withTransaction(this.connection, async (session) => {
      await this.usersService.deleteMany(
        { meeting: message.meetingId },
        session,
      );

      await this.meetingsService.deleteById(
        { meetingId: message.meetingId },
        session,
      );

      this.taskService.deleteTimeout({ name: `meeting:finish:${message.meetingId}` });

      this.emitToRoom(`meeting:${message.meetingId}`, MEETING_FINISHED, {});
    });
  }

  @SubscribeMessage(LEAVE_MEETING)
  async leaveMeeting(
    @MessageBody() message: LeaveMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );

      if (user) {
        await user.populate('meeting');

        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const meeting = await this.meetingsService.findById(
          user?.meeting?._id,
          session,
        );

        if (meeting) {
          await meeting.populate('owner');

          const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          this.emitToRoom(`meeting:${plainMeeting.id}`, REMOVE_USERS, {
            users: [plainUser.id],
          });

          const isOwner = plainMeeting.owner === plainUser.id;

          if (isOwner) {
            const endTimestamp = getTimeoutTimestamp({
              type: TimeoutTypesEnum.Minutes,
              value: 15,
            });

            if (meeting.endsAt - Date.now() > endTimestamp) {
              this.taskService.deleteTimeout({ name: `meeting:finish:${plainMeeting.id}` });

              this.taskService.addTimeout({
                name: `meeting:finish:${plainMeeting.id}`,
                ts: endTimestamp,
                callback: this.endMeeting.bind(this, message, socket),
              });
            }
          }
        }

        await this.usersService.deleteUser({ socketId: socket.id }, session);
      }
    });
  }

  @SubscribeMessage(UPDATE_MEETING)
  async updateMeeting(
    @MessageBody() message: UpdateMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );
      if (user) {
        await user.populate('meeting');

        const meeting = await this.meetingsService.updateMeetingById(
          user?.meeting?._id,
          message,
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
    });
  }
}
