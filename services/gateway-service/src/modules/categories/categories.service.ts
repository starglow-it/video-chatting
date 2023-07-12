import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { CoreBrokerPatterns } from 'shared-const';
import { DeletesBusinessCategoriesPayload, UpdateBusinessCategoryPayload } from 'shared-types';

@Injectable()
export class CategoriesService {
  constructor(private coreService: CoreService) {}

  async getBusinessCategories(payload) {
    const pattern = { cmd: CoreBrokerPatterns.GetBusinessCategories };

    return this.coreService.sendCustom(pattern, payload);
  }

  async updateBusinessCategory(payload: UpdateBusinessCategoryPayload){
    const pattern = { cmd: CoreBrokerPatterns.UpdateBusinessCategory };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteBusinessCategories(payload: DeletesBusinessCategoriesPayload){
    const pattern = { cmd: CoreBrokerPatterns.DeleteBusinessCategories };

    return this.coreService.sendCustom(pattern, payload);
  }
}
