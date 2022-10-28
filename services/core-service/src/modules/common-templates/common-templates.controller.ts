import { Controller } from '@nestjs/common';
import { Connection, UpdateQuery } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { TemplateBrokerPatterns } from 'shared';
import { TEMPLATES_SERVICE } from 'shared';

// types
import { ICommonTemplate } from 'shared';
import { EntityList } from 'shared';

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
  CreateTemplatePayload,
  EditTemplatePayload,
  UploadTemplateFilePayload,
} from 'shared';
import { UserTemplateDTO } from '../../dtos/user-template.dto';
import { CommonTemplateDocument } from '../../schemas/common-template.schema';

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
            options: { skip, limit, sort: 'maxParticipants' },
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

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplateById })
  async getCommonTemplateById(
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

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplate })
  async getCommonTemplate(
    @Payload() payload: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplate =
          await this.commonTemplatesService.findCommonTemplate({
            query: payload,
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
          query: { _id: data.templateId },
          session,
          populatePaths: ['businessCategories'],
        });

      const targetUser = await this.usersService.findUser({
        query: {
          _id: data.userId,
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
        templateType: targetTemplate.templateType,
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
        author: targetTemplate.author,
      };

      const [userTemplate] = await this.userTemplatesService.createUserTemplate(
        templateData,
        session,
      );

      targetUser.templates.push(userTemplate);

      await targetUser.save();

      return plainToInstance(UserTemplateDTO, userTemplate, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UploadTemplateFile })
  async uploadTemplateFile(
    @Payload() data: UploadTemplateFilePayload,
  ): Promise<void> {
    const { url, id, mimeType } = data;

    const previewImages = await this.commonTemplatesService.generatePreviews({
      url,
      id,
      mimeType,
    });

    const imageIds = previewImages.map((image) => image._id);

    await this.commonTemplatesService.updateCommonTemplate({
      query: {
        _id: id,
      },
      data: {
        templateType: mimeType.includes('image') ? 'image' : 'video',
        draftPreviewUrls: imageIds,
        draftUrl: url,
      },
    });

    return;
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.CreateTemplate })
  async createTemplate(@Payload() data: CreateTemplatePayload) {
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
  async editTemplate(@Payload() { templateId, data }: EditTemplatePayload) {
    return withTransaction(this.connection, async (session) => {
      const { businessCategories, ...restData } = data;

      const updateData: UpdateQuery<CommonTemplateDocument> = {
        ...restData,
        draftUrl: '',
        draftPreviewUrls: [],
      };

      if ('businessCategories' in data) {
        const businessCategoriesPromises = await Promise.all(
          businessCategories?.map(async (category) => {
            const [existingCategory] =
              await this.businessCategoriesService.find({
                query: { key: category.key },
                session,
              });

            if (existingCategory) {
              return existingCategory;
            }

            return this.businessCategoriesService.create({
              key: category.key,
              value: category.value,
              color: category.color,
            });
          }) ?? [],
        );

        updateData.businessCategories = businessCategoriesPromises.map(
          ({ _id }) => _id,
        );
      }

      const template = await this.commonTemplatesService.updateCommonTemplate({
        query: {
          _id: templateId,
        },
        data: updateData,
        session,
      });

      return plainToInstance(CommonTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }
}
