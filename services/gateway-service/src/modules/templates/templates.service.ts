import { Injectable } from '@nestjs/common';
import { TemplateBrokerPatterns } from '@shared/patterns/templates';
import { CoreService } from '../../services/core/core.service';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';
import {
  CreateUserTemplateByIdPayload,
  DeleteUsersTemplatesPayload,
  GetCommonTemplatePayload,
  GetCommonTemplatesPayload,
  GetUsersTemplatesPayload,
  GetUserTemplateByIdPayload,
  GetUserTemplateByTemplateIdPayload,
  GetUserTemplatePayload,
  GetUserTemplatesPayload,
  UpdateUserTemplatePayload,
} from '@shared/broker-payloads/templates';

@Injectable()
export class TemplatesService {
  constructor(private coreService: CoreService) {}

  async getCommonTemplates(
    payload: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getCommonTemplateById(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplateById };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplate(
    payload: GetUserTemplatePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplateById(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplateById };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createUserTemplate(
    payload: CreateUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.CreateUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplateByTemplateId(
    payload: GetUserTemplateByTemplateIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplateByTemplateId };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUserTemplates(
    payload: GetUserTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async updateUserTemplate(
    payload: UpdateUserTemplatePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.UpdateUserTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getUsersTemplates(
    payload: GetUsersTemplatesPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUsersTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteUserTemplate(
    payload: DeleteUsersTemplatesPayload,
  ): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.DeleteUsersTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createTemplate(data): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.CreateTemplate };

    return this.coreService.sendCustom(pattern, data);
  }

  async updateTemplate(data): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.UpdateTemplate };

    return this.coreService.sendCustom(pattern, data);
  }
}
