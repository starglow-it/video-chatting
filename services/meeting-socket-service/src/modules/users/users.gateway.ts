import { plainToInstance } from 'class-transformer';
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
import { IUserTemplate, MeetingAccessStatusEnum, ResponseSumType } from 'shared-types';

// services
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from './users.service';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import { TasksService } from '../tasks/tasks.service';

// dtos
import { UpdateUserRequestDTO } from '../../dtos/requests/users/update-user.dto';
import { CommonUserDTO } from '../../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../../dtos/requests/users/remove-user.dto';
import { CommonMeetingDTO } from '../../dtos/response/common-meeting.dto';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

// const
import {
  MeetingEmitEvents,
  UserEmitEvents,
} from '../../const/socket-events/emitters';
import { UsersSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingUserDocument } from 'src/schemas/meeting-user.schema';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class UsersGateway extends BaseGateway {
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

  async updateIndexUsers(userTemplateId: string, user: MeetingUserDocument) {
    try {
      const userTemplate = await this.coreService.findMeetingTemplateById({
        id: userTemplateId,
      });
      const updateIndexUsers = userTemplate.indexUsers.map(userId => {
        if (user.id.toString() === userId) return null;
        return userId;
      });

      await this.coreService.updateUserTemplate({
        userId: user.id,
        templateId: userTemplate.id,
        data: { indexUsers: updateIndexUsers }
      });
    }
    catch (err) {
      console.log(err);

    }
  }

  private async handleUpdateUsersTemplateVideoContainer(userTemplateId: string, meetingUserId: string, data: Partial<MeetingUserDocument>, session) {
   try{
    const usersTemplate = await this.coreService.findMeetingTemplateById({
      id: userTemplateId
    });

    console.log(data);
    

    const updateUser = await this.usersService.findOne({
      query: {
        _id: meetingUserId,
      },
      session,
    });

    console.log('a');
    

    let countIndexUser = 0;
    let updateUsersPosistion = usersTemplate.usersPosition;
    let updateUsersSize = usersTemplate.usersSize;

    if (data?.userPosition) {
      updateUser.userPosition = data.userPosition;

      updateUsersPosistion = usersTemplate.usersPosition.map(userPosition => {
        if(usersTemplate.indexUsers[countIndexUser] !== meetingUserId)return userPosition;
        userPosition = data?.userPosition;
        countIndexUser++;
        return userPosition;
      });
    }

    if (data?.userSize) {
      updateUser.userSize = data.userSize;
      updateUsersSize = usersTemplate.usersSize.map(userSize => {
        if(usersTemplate.indexUsers[countIndexUser] !== meetingUserId){
          countIndexUser++;
          return userSize;
        }
        countIndexUser++;
        userSize = data?.userSize;
        return userSize;
      });
    }

    updateUser.save();
    console.log(updateUsersSize);
    
    this.coreService.updateUserTemplate({
      templateId: userTemplateId,
      userId: meetingUserId,
      data: {
        usersPosition: updateUsersPosistion,
        usersSize: updateUsersSize
      }
    });
    console.log('c');
    
   }
   catch(err){
    console.log(err);
    
   }
  }

  @SubscribeMessage(UsersSubscribeEvents.OnUpdateUser)
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

      if (!user) return;

      const meeting = await this.meetingsService.findById(
        user.meeting._id,
        session,
      );

      await this.handleUpdateUsersTemplateVideoContainer(meeting.templateId, user.id.toString(),{
        userPosition: message?.userPosition,
        userSize: message?.size
      },session)

      await meeting.populate('users');



      const plainUser = plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      //TODO: ADD SIZE AND UPDATE POSISTION FOR MEETING USER VIDEO CONTAINER
      this.emitToRoom(`meeting:${user.meeting}`, UserEmitEvents.UpdateUsers, {
        users: plainUsers.map(user =>
        ({
          ...user,
          ...((message.size && message.id == user.id) && { size: message.size }),
          ...((message.userPosition && message.id == user.id) && { userPosition: message.userPosition })
        })),
      });

      return {
        success: true,
        result: {
          user: {
            ...plainUser, userPosition: { ...plainUser.userPosition, ...(message.size && { size: message?.size }) }
          }
        }
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnRemoveUser)
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

          if (user.meeting.sharingUserId === user.id) {
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

          const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          this.emitToRoom(
            `meeting:${meeting._id}`,
            MeetingEmitEvents.UpdateMeeting,
            {
              meeting: plainMeeting,
            },
          );

          this.emitToRoom(
            `meeting:${user.meeting._id}`,
            UserEmitEvents.RemoveUsers,
            {
              users: [user._id],
            },
          );

          this.emitToSocketId(user.socketId, UserEmitEvents.KickUsers);
          await this.updateIndexUsers(meeting.templateId, user);
        }

        await this.usersService.updateOne(
          { _id: message.id },
          { accessStatus: MeetingAccessStatusEnum.Left },
          session,
        );
      }
    });
  }
}
