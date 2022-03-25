import { Controller } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { plainToClass } from 'class-transformer';

import { UserTemplatesService } from './user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UsersService } from '../users/users.service';

import { UserTemplateDTO } from '../dtos/user-template.dto';

import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { IUpdateTemplate } from '@shared/interfaces/update-template.interface';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

import { EntityList } from '@shared/types/utils/http/list.type';

import {
  GET_USER_TEMPLATE,
  GET_USER_TEMPLATES,
  GET_USERS_TEMPLATES,
  UPDATE_USER_TEMPLATE,
} from '@shared/patterns/templates';

import { withTransaction } from '../helpers/mongo/withTransaction';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';
import { LanguagesService } from '../languages/languages.service';

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
    @Payload() { id }: { id: IUserTemplate['id'] },
  ): Promise<IUserTemplate> {
    try {
      const userTemplate = await this.userTemplatesService.findUserTemplateById(
        id,
      );

      await userTemplate.populate([
        'socials',
        'businessCategories',
        'languages',
        'meetingInstance',
        { path: 'user', populate: { path: 'profileAvatar'} }
      ]);

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
            populatePaths: ['businessCategories', 'user'],
          },
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: user._id,
          });

        const parsedTemplates = plainToClass(UserTemplateDTO, userTemplates, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

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
        const template = await this.userTemplatesService.findUserTemplateById(
          templateId,
        );

        await template.populate('user');

        const newBusinessCategories = await this.businessCategoriesService.find(
          { key: { $in: data.businessCategories } },
          session,
        );

        const newLanguages = await this.languageService.find(
          { key: { $in: data.languages } },
          session,
        );

        const newSocials =
          await this.userTemplatesService.createUserTemplateSocialsLinks(
            { userId: template.user._id, socials: data.socials },
            session,
          );

        const updateTemplateData = {
          fullName: data.fullName,
          position: data.position,
          languages: newLanguages.map((language) => language._id),
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          description: data.description,
          businessCategories: newBusinessCategories.map(
            (category) => category._id,
          ),
          socials: newSocials.map((social) => social._id),
        };

        const userTemplate =
          await this.userTemplatesService.findUserTemplateByIdAndUpdate(
            templateId,
            updateTemplateData,
            session,
          );

        await userTemplate.populate([
          'socials',
          'businessCategories',
          'languages',
        ]);

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
            populatePaths: 'businessCategories',
            session,
          },
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: { $ne: user },
          });

        const parsedTemplates = plainToClass(UserTemplateDTO, userTemplates, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

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
}
