import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToClass, plainToInstance } from 'class-transformer';

// const
import { MeetingBrokerPatterns } from '@shared/patterns/meetings';
import { CORE_SERVICE } from '@shared/const/services.const';

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
  GetMeetingPayload,
  AssignMeetingInstancePayload,
  UpdateMeetingInstancePayload,
  GetMeetingInstancePayload,
  CreateMeetingInstancePayload,
  DeleteMeetingInstancePayload,
} from '@shared/broker-payloads/meetings';

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
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeetingInstance })
  async getMeetingInstances(@Payload() payload: GetMeetingInstancePayload) {
    return withTransaction(this.connection, async (session) => {
      const meetingInstances = await this.meetingsService.find({
        query: payload,
        session,
      });

      return plainToInstance(CommonMeetingDTO, meetingInstances, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
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
      console.log(e);
    }
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.CreateMeetingInstance })
  async createMeetingInstance(
    @Payload() payload: CreateMeetingInstancePayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      const meetingInstances = await this.meetingsService.create(
        payload,
        session,
      );

      return plainToInstance(CommonMeetingDTO, meetingInstances, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.AssignMeetingInstance })
  async assignMeetingInstance(
    @Payload() payload: AssignMeetingInstancePayload,
  ) {
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
            serverStatus: 'active',
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
          },
          session,
        });
      } else {
        meeting = await this.meetingsService.create(
          {
            serverStatus: 'active',
            serverIp: this.defaultServerIp,
            owner: payload.userId,
          },
          session,
        );
      }

      if (userTemplate?.meetingInstance?._id) {
        await this.meetingsService.update({
          query: {
            _id: userTemplate.meetingInstance._id,
          },
          data: {
            owner: null,
          },
          session,
        });
      }

      userTemplate.usedAt = Date.now();
      userTemplate.meetingInstance = meeting;

      await userTemplate.save({ session: session.session });

      return plainToClass(UserTemplateDTO, userTemplate, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: MeetingBrokerPatterns.GetMeeting })
  async getMeeting(@Payload() payload: GetMeetingPayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const meeting = await this.meetingsService.findById(payload, session);

        await meeting.populate(['owner', 'template']);

        return plainToClass(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({ message: e.message, ctx: CORE_SERVICE });
    }
  }
}
