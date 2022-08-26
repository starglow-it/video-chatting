import { Controller } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Types, Connection, UpdateQuery } from 'mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';

import { UserTemplatesService } from './user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UsersService } from '../users/users.service';

import { UserTemplateDTO } from '../dtos/user-template.dto';

import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { IUpdateTemplate } from '@shared/interfaces/update-template.interface';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

import { EntityList } from '@shared/types/utils/http/list.type';

import {
  DELETE_USERS_TEMPLATES,
  GET_USER_TEMPLATE,
  GET_USER_TEMPLATE_BY_ID,
  GET_USER_TEMPLATE_BY_TEMPLATE_ID,
  GET_USER_TEMPLATES,
  GET_USERS_TEMPLATES,
  UPDATE_USER_TEMPLATE,
} from '@shared/patterns/templates';

import { withTransaction } from '../helpers/mongo/withTransaction';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';
import { LanguagesService } from '../languages/languages.service';
import { UserTemplateDocument } from '../schemas/user-template.schema';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';

@Controller('templates')
export class UserTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languageService: LanguagesService,
  ) {}

  @MessagePattern({ cmd: GET_USER_TEMPLATE })
  async getUserTemplate(
    @Payload()
    { id }: { id: IUserTemplate['id'] },
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

  @MessagePattern({ cmd: GET_USER_TEMPLATE_BY_TEMPLATE_ID })
  async getUserTemplateByTemplateId(
    @Payload()
    {
      id,
      userId,
    }: {
      id: ICommonTemplate['templateId'];
      userId: ICommonUserDTO['id'];
    },
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

  @MessagePattern({ cmd: GET_USER_TEMPLATE_BY_ID })
  async getUserTemplateById(
    @Payload() { id }: { id: IUserTemplate['id'] },
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

  @MessagePattern({ cmd: GET_USER_TEMPLATES })
  async getUserTemplates(
    @Payload()
    {
      userId,
      skip,
      limit,
    }: {
      userId: ICommonUserDTO['id'];
      skip: number;
      limit: number;
    },
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

  @MessagePattern({ cmd: UPDATE_USER_TEMPLATE })
  async updateUserTemplate(
    @Payload()
    {
      templateId,
      data,
    }: {
      templateId: IUserTemplate['id'];
      data: IUpdateTemplate;
    },
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
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          description: data.description,
          signBoard: data.signBoard,
          isMonetizationEnabled: data.isMonetizationEnabled,
          templatePrice: data.templatePrice,
          templateCurrency: data.templateCurrency,
          customLink: data.customLink,
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
              { path: 'user', populate: 'profileAvatar' },
            ],
          );

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

  @MessagePattern({ cmd: GET_USERS_TEMPLATES })
  async getUsersTemplates(
    @Payload()
    {
      userId,
      skip,
      limit,
    }: {
      userId: ICommonUserDTO['id'];
      skip: number;
      limit: number;
    },
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

  @MessagePattern({ cmd: DELETE_USERS_TEMPLATES })
  async deleteUserTemplate(
    @Payload() { templateId }: { templateId: IUserTemplate['id'] },
  ): Promise<undefined> {
    try {
      return withTransaction(this.connection, async (session) => {
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
}
