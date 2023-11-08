import { Controller } from '@nestjs/common';
import { MeetingAvatarsService } from './meeting-avatars.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MEETING_AVATAR_SERVICE, MeetingBrokerPatterns } from 'shared-const';
import {
  CreateMeetingAvatarPayload,
  EntityList,
  GetMeetingAvatarPayload,
  GetMeetingAvatarsPayload,
  IMeetingAvatar,
  MeetingAvatarStatus,
} from 'shared-types';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, FilterQuery } from 'mongoose';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { plainToInstance } from 'class-transformer';
import { CommonMeetingAvatarDto } from '../../dtos/common-meeting-avatar.dto';
import { MeetingAvatarDocument } from '../../schemas/meeting-avatar.schema';
import { ResoucesService } from '../resouces/resouces.service';

@Controller('meeting-avatars')
export class MeetingAvatarsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly resouceService: ResoucesService,
    private readonly meetingAvatarService: MeetingAvatarsService,
  ) {}

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeetingAvatars })
  async getMeetingAvatars(
    @Payload() payload: GetMeetingAvatarsPayload,
  ): Promise<EntityList<IMeetingAvatar>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const { skip, limit } = payload;

        const skipQuery = skip || 0;
        const limitQuery = limit || 8;
        const query: FilterQuery<MeetingAvatarDocument> = {
          status: MeetingAvatarStatus.Active,
        };

        const count = await this.meetingAvatarService.count(query);

        const resouces = await this.meetingAvatarService.find({
          query,
          options: {
            skip: skipQuery * limitQuery,
            limit: limitQuery,
          },
          session,
          populatePaths: ['resouce'],
        });

        const list = plainToInstance(CommonMeetingAvatarDto, resouces, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        return {
          list,
          count,
        };
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: MEETING_AVATAR_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeetingAvatar })
  async getMeetingAvatar(
    @Payload() { query }: GetMeetingAvatarPayload,
  ): Promise<IMeetingAvatar> {
    return withTransaction(this.connection, async (session) => {
      try {
        const meetingAvatar = await this.meetingAvatarService.findOne({
          query,
          session,
          populatePaths: ['resouce'],
        });

        if (!meetingAvatar || !meetingAvatar?.resouce) {
          throw new RpcException({
            message: 'Meeting Avatar not found',
            ctx: MEETING_AVATAR_SERVICE,
          });
        }

        return plainToInstance(CommonMeetingAvatarDto, meetingAvatar, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: MEETING_AVATAR_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.CreateMeetingAvatar })
  async createUserTemplateMedia(
    @Payload() { resouceId, roles }: CreateMeetingAvatarPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const resouce = await this.resouceService.findOne({
          query: { _id: resouceId },
          session,
        });
        if (!resouce) {
          throw new RpcException({
            message: 'Resouce not found',
            ctx: MEETING_AVATAR_SERVICE,
          });
        }

        const meetingAvatar = await this.meetingAvatarService.create({
          data: {
            resouce,
            status: MeetingAvatarStatus.Active,
            roles,
          },
          session,
        });

        return plainToInstance(CommonMeetingAvatarDto, meetingAvatar, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: MEETING_AVATAR_SERVICE,
        });
      }
    });
  }
}
