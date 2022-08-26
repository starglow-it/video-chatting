import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';

// const
import {
  CREATE_MEETING,
  DELETE_MEETING,
  GET_MEETING,
} from '@shared/patterns/meetings';
import { CORE_SERVICE } from '@shared/const/services.const';

// types
import { ICreateMeetingDTO } from '@shared/interfaces/create-meeting.interface';
import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';

// dtos
import { CommonMeetingDTO } from '../dtos/common-meeting.dto';
import { UserTemplateDTO } from '../dtos/user-template.dto';

// services
import { UsersService } from '../users/users.service';
import { MeetingsService } from './meetings.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private userTemplatesService: UserTemplatesService,
    private commonTemplatesService: CommonTemplatesService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: CREATE_MEETING })
  async createMeeting(@Payload() data: ICreateMeetingDTO) {
    try {
      return withTransaction(this.connection, async (session) => {
        const targetTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: data.templateId,
            session,
          });

        const meeting = await this.meetingsService.create(
          { userId: data.userId },
          session,
        );

        const user = await this.usersService.findById(data.userId, session);

        let userTemplate = await this.userTemplatesService.findUserTemplate({
          query: {
            $or: [
              { templateId: targetTemplate?.templateId, user: user._id },
              { _id: data.templateId },
            ],
          },
          session,
          populatePaths: 'meetingInstance',
        });

        if (userTemplate) {
          if (userTemplate?.meetingInstance?._id) {
            await this.meetingsService.deleteMeeting(
              userTemplate.meetingInstance._id,
              session,
            );
          }

          userTemplate.usedAt = Date.now();
          userTemplate.meetingInstance = meeting;

          await userTemplate.save();
        } else {
          await user.populate(['socials', 'languages', 'templates']);

          const templateData = {
            user: user._id,
            templateId: targetTemplate.templateId,
            url: targetTemplate.url,
            name: targetTemplate.name,
            maxParticipants: targetTemplate.maxParticipants,
            previewUrls: targetTemplate.previewUrls,
            type: targetTemplate.type,
            priceInCents: targetTemplate.priceInCents,
            description: targetTemplate.description,
            usersPosition: targetTemplate.usersPosition,
            isAudioAvailable: targetTemplate.isAudioAvailable,
            links: targetTemplate.links,
            businessCategories: targetTemplate.businessCategories.map(
              (category) => category._id,
            ),
            fullName: user.fullName,
            position: user.position,
            companyName: user.companyName,
            contactEmail: user.contactEmail,
            languages: user.languages.map((language) => language._id),
            socials: user.socials.map((social) => social._id),
            signBoard: user.signBoard,
            meetingInstance: meeting,
          };

          [userTemplate] = await this.userTemplatesService.createUserTemplate(
            templateData,
            session,
          );

          user.templates.push(userTemplate);

          await user.save();
        }

        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (e) {
      throw new RpcException({ message: e.message, ctx: CORE_SERVICE });
    }
  }

  @MessagePattern({ cmd: DELETE_MEETING })
  async deleteMeeting(@Payload() data: { templateId: string }) {
    try {
      return withTransaction(this.connection, async (session) => {
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: { _id: data?.templateId },
          session,
          populatePaths: 'meetingInstance',
        });

        await this.meetingsService.deleteMeeting(
          userTemplate.meetingInstance._id,
          session,
        );
      });
    } catch (e) {
      throw new RpcException({ message: e.message, ctx: CORE_SERVICE });
    }
  }

  @MessagePattern({ cmd: GET_MEETING })
  async getMeeting(
    @Payload() data: { meetingId: ICommonMeetingInstanceDTO['id'] },
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const meeting = await this.meetingsService.findById(data, session);

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
