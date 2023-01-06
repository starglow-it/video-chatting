import { Injectable } from '@nestjs/common';
import {TemplateBrokerPatterns, TemplateSoundBrokerPatterns} from 'shared-const';
import { CoreService } from '../../services/core/core.service';
import {
  EntityList,
  ICommonTemplate,
  IUserTemplate,
  GetCommonTemplatePayload,
  GetCommonTemplatesPayload,
  DeleteCommonTemplatePayload,
  EditTemplatePayload,
  CreateTemplatePayload,
  GetCommonTemplateByIdPayload,
  CreateTemplateSoundPayload,
  ITemplateSoundFile,
  AddTemplateToUserPayload,
  UploadTemplateFilePayload,
} from 'shared-types';

@Injectable()
export class TemplatesService {
  constructor(private coreService: CoreService) {}

  async getCommonTemplates(
    payload: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplates };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getCommonTemplate(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getCommonTemplateById(
    payload: GetCommonTemplateByIdPayload,
  ): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplateById };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createTemplate(payload: CreateTemplatePayload): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.CreateTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async updateTemplate(payload: EditTemplatePayload): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.UpdateTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteCommonTemplate(
    payload: DeleteCommonTemplatePayload,
  ): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.DeleteCommonTemplate };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createTemplateSound(
      payload: CreateTemplateSoundPayload,
  ): Promise<ITemplateSoundFile> {
    const pattern = {
      cmd: TemplateSoundBrokerPatterns.CreateTemplateSoundFile,
    };

    return this.coreService.sendCustom(pattern, payload);
  }

  async addTemplateToUser(
      payload: AddTemplateToUserPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadTemplateFile(payload: UploadTemplateFilePayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.UploadTemplateFile };

    return this.coreService.sendCustom(pattern, payload);
  }
}
