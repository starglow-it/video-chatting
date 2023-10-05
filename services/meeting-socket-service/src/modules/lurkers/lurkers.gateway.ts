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
import { BaseGateway } from '../../gateway/base.gateway';

// types
import {
  AnswerSwitchRoleAction,
  MeetingAccessStatusEnum,
  MeetingRole,
} from 'shared-types';

// services
import { MeetingsService } from '../meetings/meetings.service';

// dtos
import { userSerialization } from '../../dtos/response/common-user.dto';
import { meetingSerialization } from '../../dtos/response/common-meeting.dto';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

// const
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { wsError } from '../../utils/ws/wsError';
import { SwitchRoleByHostRequestDto } from '../../dtos/requests/users/request-switch-role-by-host.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { AnswerSwitchRoleByLurkerRequestDto } from '../../dtos/requests/users/answer-switch-role-by-lurker.dto';
import { SwitchRoleByLurkerRequestDto } from '../../dtos/requests/users/request-switch-role-by-lurker.dto';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { ObjectId } from '../../utils/objectId';
import { AnswerSwitchRoleByHostRequestDto } from '../../dtos/requests/users/answer-switch-role-by-host.dto';
import { UsersService } from '../users/users.service';
import { UsersSubscribeEvents } from 'src/const/socket-events/subscribers';
import { UserEmitEvents } from 'src/const/socket-events/emitters';
import { CoreService } from 'src/services/core/core.service';

type TRequestSwitchRoleParams = {
  meetingUser: MeetingUserDocument;
  socketEmitterId: string;
  meeting: MeetingDocument;
};

type TAnswerSwitchRoleParams = {
  action: AnswerSwitchRoleAction;
} & TRequestSwitchRoleParams;

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class LurkersGateway extends BaseGateway {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly usersService: UsersService,
    private readonly coreService: CoreService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  async sendSwtichRoleRequest({
    meetingUser,
    meeting,
    socketEmitterId,
  }: TRequestSwitchRoleParams) {
    await meeting.populate('users');
    const plainMeeting = meetingSerialization(meeting);
    const plainUsers = userSerialization(meeting.users);
    const plainUser = userSerialization(meetingUser);

    this.emitToSocketId(socketEmitterId, UserEmitEvents.RequestSwitchRole, {
      user: plainUser,
      meeting: plainMeeting,
    });

    return wsResult({
      meeting: plainMeeting,
      users: plainUsers,
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnRequestRoleByLurker)
  async requestSwitchRoleByLurker(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SwitchRoleByLurkerRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const { meetingId } = msg;
      try {
        const meetingUser = await this.usersService.findOne({
          query: {
            socketId: socket.id,
            meetingRole: MeetingRole.Lurker,
          },
          session,
        });

        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'User not found',
          });
        }

        const meeting = await this.meetingsService.findById(meetingId, session);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        const host = await this.usersService.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        if (!host) {
          return wsError(socket.id, {
            message: 'Host not found',
          });
        }

        return await this.sendSwtichRoleRequest({
          meetingUser,
          meeting,
          socketEmitterId: host.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnRequestRoleByHost)
  async requestSwitchRoleByHost(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SwitchRoleByHostRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const { meetingId, meetingUserId } = msg;
      try {
        const meetingUser = await this.usersService.findOne({
          query: {
            _id: new ObjectId(meetingUserId),
            meetingRole: MeetingRole.Lurker,
          },
          session,
        });

        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'User not found',
          });
        }

        const meeting = await this.meetingsService.findById(meetingId, session);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        return await this.sendSwtichRoleRequest({
          meeting,
          meetingUser,
          socketEmitterId: meetingUser.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  async answerSwitchRoleRequest({
    meeting,
    meetingUser,
    socketEmitterId,
    action,
  }: TAnswerSwitchRoleParams) {
    await meeting.populate('users');
    const plainMeeting = meetingSerialization(meeting);
    const plainUser = userSerialization(meetingUser);
    const plainUsers = userSerialization(meeting.users);
    this.emitToSocketId(socketEmitterId, UserEmitEvents.AnswerSwitchRole, {
      meeting: plainMeeting,
      users: plainUsers,
      user: plainUser,
      action,
    });
    return wsResult({
      meeting: plainMeeting,
      user: plainUser,
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnAnswerRequestByHost)
  async answerSwitchRoleByHost(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    { action, meetingUserId, meetingId }: AnswerSwitchRoleByHostRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const meeting = await this.meetingsService.findById(meetingId);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          return wsError(socket.id, 'User template not found');
        }

        const index = userTemplate.indexUsers.indexOf(null);
        if (index === -1) {
          return wsError(socket.id, 'meeting.maxParticipantsNumber');
        }

        const meetingUser = await this.usersService.findOneAndUpdate(
          {
            _id: new ObjectId(meetingUserId),
            meetingRole: MeetingRole.Lurker,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
          },
          {
            ...(action === AnswerSwitchRoleAction.Accept && {
              meetingRole: MeetingRole.Participant,
              userPosition: userTemplate.usersPosition[index],
              userSize: userTemplate.usersSize[index],
            }),
          },
          session,
        );
        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'No meeting user found',
          });
        }

        return await this.answerSwitchRoleRequest({
          meeting,
          meetingUser,
          action,
          socketEmitterId: meetingUser.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnAnswerRequestByLurker)
  async answerSwitchRoleByLurker(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { action, meetingId }: AnswerSwitchRoleByLurkerRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const meeting = await this.meetingsService.findById(meetingId);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          return wsError(socket.id, 'User template not found');
        }

        const index = userTemplate.indexUsers.indexOf(null);
        if (index === -1) {
          return wsError(socket.id, 'meeting.maxParticipantsNumber');
        }

        const meetingUser = await this.usersService.findOneAndUpdate(
          {
            socketId: socket.id,
            meetingRole: MeetingRole.Lurker,
          },
          {
            ...(action === AnswerSwitchRoleAction.Accept && {
              meetingRole: MeetingRole.Participant,
              userPosition: userTemplate.usersPosition[index],
              userSize: userTemplate.usersSize[index],
            }),
          },
          session,
        );

        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'No meeting user found',
          });
        }

        const host = await this.usersService.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        if (!host) {
          return wsError(socket.id, {
            message: 'Host not found',
          });
        }

        return await this.answerSwitchRoleRequest({
          meeting,
          meetingUser,
          action,
          socketEmitterId: host.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }
}
