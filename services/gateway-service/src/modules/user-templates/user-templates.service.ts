import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import {
  IUserTemplate,
  EntityList,
  CountUserTemplatesPayload,
  CreateUserTemplateByIdPayload,
  DeleteUsersTemplatesPayload,
  GetUsersTemplatesPayload,
  GetUserTemplateByIdPayload,
  GetUserTemplateByTemplateIdPayload,
  GetUserTemplatePayload,
  GetUserTemplatesPayload,
  UpdateUserTemplatePayload,
  DeleteGlobalUserTemplatesPayload,
} from 'shared-types';
import { UserTemplatesBrokerPatterns } from 'shared-const';

@Injectable()
export class UserTemplatesService {
  constructor(private coreService: CoreService) {}

  async getUserTemplate(
    payload: GetUserTemplatePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplateById(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplateById };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createUserTemplate(
    payload: CreateUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.CreateUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplateByTemplateId(
    payload: GetUserTemplateByTemplateIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.GetUserTemplateByTemplateId,
    };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplates(
    payload: GetUserTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async updateUserTemplate(
    payload: UpdateUserTemplatePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.UpdateUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUsersTemplates(
    payload: GetUsersTemplatesPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUsersTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteUserTemplate(
    payload: DeleteUsersTemplatesPayload,
  ): Promise<void> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.DeleteUsersTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteGlobalUserTemplates(payload: DeleteGlobalUserTemplatesPayload) {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.DeleteGlobalUserTemplates,
    };
    return this.coreService.sendCustom(pattern, payload);
  }

  async countUserTemplates(
    payload: CountUserTemplatesPayload,
  ): Promise<{ count: number }> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.CountUserTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }
}
