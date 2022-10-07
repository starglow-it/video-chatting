import { Controller } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Types, Connection, UpdateQuery } from 'mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';

import { UserTemplatesService } from './user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UsersService } from '../users/users.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';

import { UserTemplateDTO } from '../../dtos/user-template.dto';

import { IUserTemplate } from '@shared/interfaces/user-template.interface';

import { EntityList } from '@shared/types/utils/http/list.type';

import { TemplateBrokerPatterns } from '@shared/patterns/templates';

import { withTransaction } from '../../helpers/mongo/withTransaction';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';
import { LanguagesService } from '../languages/languages.service';
import { UserTemplateDocument } from '../../schemas/user-template.schema';
import {
  CreateUserTemplateByIdPayload,
  DeleteUsersTemplatesPayload,
  GetUsersTemplatesPayload,
  GetUserTemplateByIdPayload,
  GetUserTemplateByTemplateIdPayload,
  GetUserTemplatePayload,
  GetUserTemplatesPayload,
  UpdateUserTemplatePayload,
} from '@shared/broker-payloads/templates';

@Controller('templates')
export class UserTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private userTemplatesService: UserTemplatesService,
    private commonTemplatesService: CommonTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languageService: LanguagesService,
  ) {}

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetUserTemplate })
  async getUserTemplate(
    @Payload()
    { id }: GetUserTemplatePayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const customLinkRegexp = new RegExp(`^${id}$`);

        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: Types.ObjectId.isValid(id)
            ? { _id: id }
            : { customLink: customLinkRegexp },
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
            { path: 'author' },
          ],
        });

        if (userTemplate?.customLink && Types.ObjectId.isValid(id)) {
          return null;
        }

        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetUserTemplateByTemplateId })
  async getUserTemplateByTemplateId(
    @Payload()
    { id, userId }: GetUserTemplateByTemplateIdPayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: { templateId: id, user: userId },
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
          ],
        });

        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.CreateUserTemplate })
  async createMeetingTemplate(
    @Payload() { id, userId }: CreateUserTemplateByIdPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const targetTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
          });

        const user = await this.usersService.findById(userId, session);

        await user.populate(['socials', 'languages', 'templates']);

        const templateData = {
          user: user._id,
          templateId: targetTemplate.templateId,
          author: targetTemplate.author,
          url: targetTemplate.url,
          name: targetTemplate.name,
          maxParticipants: targetTemplate.maxParticipants,
          previewUrls: targetTemplate.previewUrls,
          type: targetTemplate.type,
          priceInCents: targetTemplate.priceInCents,
          description: targetTemplate.description,
          shortDescription: targetTemplate.shortDescription,
          usersPosition: targetTemplate.usersPosition,
          isAudioAvailable: targetTemplate.isAudioAvailable,
          links: targetTemplate.links,
          isPublic: targetTemplate.isPublic,
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
        };

        const [userTemplate] =
          await this.userTemplatesService.createUserTemplate(
            templateData,
            session,
          );

        user.templates.push(userTemplate);

        await user.save({ session: session.session });

        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetUserTemplateById })
  async getUserTemplateById(
    @Payload() { id }: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: { _id: id },
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
          ],
        });

        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetUserTemplates })
  async getUserTemplates(
    @Payload()
    { userId, skip, limit }: GetUserTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const user = await this.usersService.findById(userId, session);

        const userTemplates = await this.userTemplatesService.findUserTemplates(
          {
            query: { user: user._id },
            options: { sort: '-usedAt', skip, limit },
            populatePaths: ['businessCategories', 'user', 'previewUrls'],
          },
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: user._id,
          });

        const parsedTemplates = plainToInstance(
          UserTemplateDTO,
          userTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: userTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UpdateUserTemplate })
  async updateUserTemplate(
    @Payload()
    { templateId, userId, data }: UpdateUserTemplatePayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const template = await this.userTemplatesService.findUserTemplateById({
          id: templateId,
          session,
          populatePaths: 'user',
        });

        const updateTemplateData = {
          fullName: data.fullName,
          position: data.position,
          usersPosition: data.usersPosition,
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          description: data.description,
          signBoard: data.signBoard,
          isMonetizationEnabled: data.isMonetizationEnabled,
          templatePrice: data.templatePrice,
          templateCurrency: data.templateCurrency,
          customLink: data.customLink,
          name: data.name,
          isPublic: data.isPublic,
          maxParticipants: data.maxParticipants,
          url: data.url,
          previewUrls: data.previewUrls,
        } as UpdateQuery<UserTemplateDocument>;

        if ('businessCategories' in data) {
          const newBusinessCategories =
            await this.businessCategoriesService.find({
              query: { key: { $in: data.businessCategories || [] } },
              session,
            });

          updateTemplateData.businessCategories = newBusinessCategories.map(
            (category) => category._id,
          );
        }

        if ('languages' in data) {
          const newLanguages = await this.languageService.find({
            query: { key: { $in: data.languages || [] } },
            session,
          });

          updateTemplateData.languages = newLanguages.map(
            (language) => language._id,
          );
        }
        if ('socials' in data) {
          const newSocials =
            await this.userTemplatesService.createUserTemplateSocialsLinks(
              { userId: template.user._id, socials: data.socials || [] },
              session,
            );

          updateTemplateData.socials = newSocials.map((social) => social._id);
        }

        const userTemplate =
          await this.userTemplatesService.findUserTemplateByIdAndUpdate(
            templateId,
            updateTemplateData,
            session,
            [
              { path: 'socials' },
              { path: 'businessCategories' },
              { path: 'languages' },
              { path: 'meetingInstance' },
              { path: 'previewUrls' },
              { path: 'author' },
              { path: 'user', populate: 'profileAvatar' },
            ],
          );

        if (userTemplate?.author?._id?.toString?.() === userId) {
          const updateCommonTemplateData = {
            isPublic: userTemplate.isPublic,
          };
          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              templateId: userTemplate.templateId,
            },
            data: {
              $set: updateCommonTemplateData,
            },
            session,
          });
        }
        return plainToClass(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetUsersTemplates })
  async getUsersTemplates(
    @Payload()
    { userId, skip, limit }: GetUsersTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const user = await this.usersService.findById(userId, session);

        const userTemplates = await this.userTemplatesService.findUserTemplates(
          {
            query: { user: { $ne: user } },
            options: { sort: '-usedAt', skip, limit },
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
              { path: 'user', populate: { path: 'profileAvatar' } },
            ],
            session,
          },
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: { $ne: user },
          });

        const parsedTemplates = plainToInstance(
          UserTemplateDTO,
          userTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: userTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.DeleteUsersTemplates })
  async deleteUserTemplate(
    @Payload() { templateId, userId }: DeleteUsersTemplatesPayload,
  ): Promise<undefined> {
    try {
      return withTransaction(this.connection, async (session) => {
        const userTemplate =
          await this.userTemplatesService.findUserTemplateById({
            id: templateId,
            session,
            populatePaths: 'author',
          });

        if (!userTemplate) {
          return;
        }

        if (userTemplate?.author?._id?.toString?.() === userId) {
          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              templateId: userTemplate.templateId,
            },
            data: {
              isPublic: false,
            },
            session,
          });
        }
        await this.userTemplatesService.deleteUserTemplate(
          { _id: templateId },
          session,
        );

        return;
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UploadProfileTemplateFile })
  async uploadProfileTemplateFile(
    @Payload() data: { url: string; id: string; mimeType: string },
  ) {
    const { url, id, mimeType } = data;

    const previewImages = await this.userTemplatesService.generatePreviews({
      url,
      id,
      mimeType,
    });

    const imageIds = previewImages.map((image) => image._id);

    return this.userTemplatesService.updateUserTemplate({
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
}
