import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import {
  GET_COMMON_TEMPLATE,
  GET_COMMON_TEMPLATES,
} from '@shared/patterns/templates';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';

// types
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';

// dtos
import { CommonTemplateDTO } from '../dtos/common-template.dto';

// services
import { CommonTemplatesService } from './common-templates.service';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';
import { ADD_TEMPLATE_TO_USER } from '@shared/patterns/templates';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from '../users/users.service';

@Controller('common-templates')
export class CommonTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private meetingsService: MeetingsService,
    private usersService: UsersService,
  ) {}

  @MessagePattern({ cmd: GET_COMMON_TEMPLATES })
  async getCommonTemplates(
    @Payload() { skip = 0, limit = 6 }: { skip: number; limit: number },
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplates =
          await this.commonTemplatesService.findCommonTemplates({
            query: {},
            options: { skip, limit },
            populatePaths: ['businessCategories', 'previewUrls'],
            session,
          });

        const commonTemplatesCount =
          await this.commonTemplatesService.countCommonTemplates();

        const parsedTemplates = plainToInstance(
          CommonTemplateDTO,
          commonTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: commonTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_COMMON_TEMPLATE })
  async getCommonTemplate(
    @Payload() { id }: { id: ICommonTemplate['id'] },
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplates =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
            ],
          });

        return plainToInstance(CommonTemplateDTO, commonTemplates, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: ADD_TEMPLATE_TO_USER })
  async addTemplateToUser(
    @Payload() data: { productId: string; customerId: string },
  ) {
    return withTransaction(this.connection, async (session) => {
      const targetTemplate =
        await this.commonTemplatesService.findCommonTemplate({
          query: { stripeProductId: data.productId },
          session,
        });

      const targetUer = await this.usersService.findUser({
        query: { stripeCustomerId: data.customerId },
        session,
        populatePaths: ['socials', 'languages', 'templates'],
      });

      const meeting = await this.meetingsService.create(
        { userId: targetUer._id },
        session,
      );

      const templateData = {
        user: targetUer._id,
        templateId: targetTemplate.templateId,
        url: targetTemplate.url,
        name: targetTemplate.name,
        maxParticipants: targetTemplate.maxParticipants,
        previewUrls: targetTemplate.previewUrls,
        type: targetTemplate.type,
        priceInCents: targetTemplate.priceInCents,
        businessCategories: targetTemplate.businessCategories.map(
          (category) => category._id,
        ),
        fullName: targetUer.fullName,
        position: targetUer.position,
        description: targetUer.description || targetTemplate.description,
        companyName: targetUer.companyName,
        contactEmail: targetUer.contactEmail,
        languages: targetUer.languages.map((language) => language._id),
        socials: targetUer.socials.map((social) => social._id),
        meetingInstance: meeting,
        usersPosition: targetTemplate.usersPosition,
        isAudioAvailable: targetTemplate.isAudioAvailable,
        links: targetTemplate.links,
        signBoard: targetUer.signBoard,
      };

      const [userTemplate] = await this.userTemplatesService.createUserTemplate(
        templateData,
        session,
      );

      targetUer.templates.push(userTemplate);

      await targetUer.save();
    });
  }
}
