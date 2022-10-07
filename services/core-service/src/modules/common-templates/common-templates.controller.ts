import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { TemplateBrokerPatterns } from '@shared/patterns/templates';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';

// types
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';

// dtos
import { CommonTemplateDTO } from '../../dtos/common-template.dto';

// services
import { CommonTemplatesService } from './common-templates.service';
import { UsersService } from '../users/users.service';
import { MeetingsService } from '../meetings/meetings.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';
import {
  AddTemplateToUserPayload,
  GetCommonTemplatePayload,
  GetCommonTemplatesPayload,
} from '@shared/broker-payloads/templates';

@Controller('common-templates')
export class CommonTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
  ) {}

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplates })
  async getCommonTemplates(
    @Payload() { skip = 0, limit = 6 }: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplates =
          await this.commonTemplatesService.findCommonTemplates({
            query: { draft: false, isPublic: true },
            options: { skip, limit },
            populatePaths: ['businessCategories', 'previewUrls'],
            session,
          });

        const commonTemplatesCount =
          await this.commonTemplatesService.countCommonTemplates({
            query: { draft: false, isPublic: true },
          });

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

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplate })
  async getCommonTemplate(
    @Payload() { id }: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
            ],
          });

        return plainToInstance(CommonTemplateDTO, commonTemplate, {
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

  @MessagePattern({ cmd: TemplateBrokerPatterns.AddTemplateToUser })
  async addTemplateToUser(@Payload() data: AddTemplateToUserPayload) {
    return withTransaction(this.connection, async (session) => {
      const targetTemplate =
        await this.commonTemplatesService.findCommonTemplate({
          query: { stripeProductId: data.productId },
          session,
        });

      const targetUser = await this.usersService.findUser({
        query: {
          $or: [
            { stripeSessionId: data.sessionId },
            { stripeCustomerId: data.customerId },
          ],
        },
        session,
        populatePaths: ['socials', 'languages', 'templates'],
      });

      const templateData = {
        user: targetUser._id,
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
        fullName: targetUser.fullName,
        position: targetUser.position,
        description: targetTemplate.description,
        shortDescription: targetTemplate.shortDescription,
        companyName: targetUser.companyName,
        contactEmail: targetUser.contactEmail,
        languages: targetUser.languages.map((language) => language._id),
        socials: targetUser.socials.map((social) => social._id),
        usersPosition: targetTemplate.usersPosition,
        isAudioAvailable: targetTemplate.isAudioAvailable,
        links: targetTemplate.links,
        signBoard: targetUser.signBoard,
      };

      const [userTemplate] = await this.userTemplatesService.createUserTemplate(
        templateData,
        session,
      );

      targetUser.templates.push(userTemplate);

      await targetUser.save();
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UploadTemplateFile })
  async uploadTemplateFile(
    @Payload() data: { url: string; id: string; mimeType: string },
  ) {
    const { url, id, mimeType } = data;

    const previewImages = await this.commonTemplatesService.generatePreviews({
      url,
      id,
      mimeType,
    });

    const imageIds = previewImages.map((image) => image._id);

    return this.commonTemplatesService.updateCommonTemplate({
      query: {
        _id: id,
      },
      data: {
        $set: {
          draftPreviewUrls: imageIds,
          draftUrl: url,
        },
      },
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.CreateTemplate })
  async createTemplate(@Payload() data: { userId: string }) {
    return withTransaction(this.connection, async (session) => {
      const template = await this.commonTemplatesService.createCommonTemplate({
        data: {
          author: data.userId,
        },
        session,
      });

      return plainToInstance(CommonTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UpdateTemplate })
  async editTemplate(
    @Payload()
    templateData: Omit<Partial<ICommonTemplate>, 'businessCategories'> & {
      businessCategories: string[];
    },
  ) {
    return withTransaction(this.connection, async (session) => {
      const { id, businessCategories } = templateData;

      const businessCategoriesPromises = await Promise.all(
        businessCategories?.map(async (category) => {
          const [existingCategory] = await this.businessCategoriesService.find({
            query: { key: category },
            session,
          });
          return (
            existingCategory ??
            this.businessCategoriesService.create({
              key: category,
              value: category,
              color: '#000000',
            })
          );
        }) ?? [],
      );

      const ids = businessCategoriesPromises.map(({ _id }) => _id);

      const template = await this.commonTemplatesService.updateCommonTemplate({
        query: {
          _id: id,
        },
        data: {
          $set: {
            ...templateData,
            businessCategories: ids,
            draftUrl: '',
            draftPreviewUrls: [],
          },
        },
        session,
      });

      return plainToInstance(CommonTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }
}
