import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';

// const
import { MeetingBrokerPatterns } from 'shared-const';
import { CORE_SERVICE } from 'shared-const';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

// dtos
import { CommonMeetingDTO } from '../../dtos/common-meeting.dto';
import { UserTemplateDTO } from '../../dtos/user-template.dto';

// services
import { UsersService } from '../users/users.service';
import { MeetingsService } from './meetings.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';
import { ConfigClientService } from '../../services/config/config.service';

// payloads
import {
  AssignMeetingInstancePayload,
  CreateMeetingInstancePayload,
  DeleteMeetingInstancePayload,
  GetMeetingInstancePayload,
  UpdateMeetingInstancePayload,
  GetMeetingPayload,
  MeetingInstanceServerStatus,
} from 'shared-types';

@Controller('meetings')
export class MeetingsController {
  supportScaling: boolean;
  defaultServerIp: string;

  constructor(
    private meetingsService: MeetingsService,
    private configService: ConfigClientService,
    private usersService: UsersService,
    private userTemplatesService: UserTemplatesService,
    private commonTemplatesService: CommonTemplatesService,
    @InjectConnection() private connection: Connection,
  ) {}

  async onModuleInit() {
    this.supportScaling = await this.configService.get<boolean>(
      'supportScaling',
    );
    this.defaultServerIp = await this.configService.get<string>(
      'defaultServerIp',
    );
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.UpdateMeetingInstance })
  async updateMeetingInstance(
    @Payload() payload: UpdateMeetingInstancePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const meeting = await this.meetingsService.update({
          query: { instanceId: payload.instanceId },
          data: payload.data,
          session,
        });

        return plainToInstance(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeetingInstance })
  async getMeetingInstances(@Payload() payload: GetMeetingInstancePayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const query = { ...payload, serverIp: { $ne: this.defaultServerIp } };

        const meetingInstances = await this.meetingsService.find({
          query,
          session,
        });

        return plainToInstance(CommonMeetingDTO, meetingInstances, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.DeleteMeetingInstance })
  async deleteMeetingInstance(
    @Payload() payload: DeleteMeetingInstancePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        await this.meetingsService.deleteMeeting({
          query: { _id: payload.id },
          session,
        });

        return;
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.CreateMeetingInstance })
  async createMeetingInstance(
    @Payload() payload: CreateMeetingInstancePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const meetingInstances = await this.meetingsService.create({
          data: payload,
          session,
        });

        return plainToInstance(CommonMeetingDTO, meetingInstances, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.AssignMeetingInstance })
  async assignMeetingInstance(
    @Payload() payload: AssignMeetingInstancePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        let meeting;

        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: { _id: payload.templateId },
          session,
          populatePaths: 'meetingInstance',
        });

        if (this.supportScaling && userTemplate.maxParticipants > 4) {
          [meeting] = await this.meetingsService.find({
            query: {
              serverStatus: MeetingInstanceServerStatus.Active,
              owner: null,
            },
            session,
          });

          meeting = await this.meetingsService.update({
            query: {
              _id: meeting.id,
            },
            data: {
              owner: payload.userId,
              startAt: payload.startAt,
              aboutTheHost: payload.aboutTheHost,
              content: payload.content
            },
            session,
          });
        } else {
          meeting = await this.meetingsService.create({
            data: {
              serverStatus: MeetingInstanceServerStatus.Active,
              serverIp: this.defaultServerIp,
              owner: payload.userId,
              startAt: payload.startAt,
              aboutTheHost: payload.aboutTheHost,
              content: payload.content
            },
            session,
          });
        }

        userTemplate.usedAt = Date.now();
        userTemplate.meetingInstance = meeting;

        await userTemplate.save({ session: session.session });

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeeting })
  async getMeeting(@Payload() payload: GetMeetingPayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const meeting = await this.meetingsService.findById(payload, session);

        await meeting.populate(['owner', 'template']);

        return plainToInstance(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({
        message: e.message,
        ctx: CORE_SERVICE,
      });
    }
  }
}
