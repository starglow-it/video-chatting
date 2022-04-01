import { Injectable } from '@nestjs/common';
import {
  DELETE_USERS_TEMPLATES,
  GET_COMMON_TEMPLATE,
  GET_COMMON_TEMPLATES,
  GET_USER_TEMPLATE,
  GET_USER_TEMPLATES,
  GET_USERS_TEMPLATES,
  UPDATE_USER_TEMPLATE,
} from '@shared/patterns/templates';
import { CoreService } from '../core/core.service';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';

@Injectable()
export class TemplatesService {
  constructor(private coreService: CoreService) {}

  async getCommonTemplates(data): Promise<EntityList<ICommonTemplate>> {
    const pattern = { cmd: GET_COMMON_TEMPLATES };

    return this.coreService.sendCustom(pattern, data);
  }

  async getCommonTemplate(data: { id: ICommonTemplate['id'] }) {
    const pattern = { cmd: GET_COMMON_TEMPLATE };

    return this.coreService.sendCustom(pattern, data);
  }

  async getUserTemplate(data): Promise<IUserTemplate> {
    const pattern = { cmd: GET_USER_TEMPLATE };

    return this.coreService.sendCustom(pattern, data);
  }

  async getUserTemplates(data): Promise<EntityList<IUserTemplate>> {
    const pattern = { cmd: GET_USER_TEMPLATES };

    return this.coreService.sendCustom(pattern, data);
  }

  async updateUserTemplate(data): Promise<IUserTemplate> {
    const pattern = { cmd: UPDATE_USER_TEMPLATE };

    return this.coreService.sendCustom(pattern, data);
  }

  async getUsersTemplates(data): Promise<IUserTemplate> {
    const pattern = { cmd: GET_USERS_TEMPLATES };

    return this.coreService.sendCustom(pattern, data);
  }

  async deleteUserTemplate(data): Promise<void> {
    const pattern = { cmd: DELETE_USERS_TEMPLATES };

    return this.coreService.sendCustom(pattern, data);
  }
}
