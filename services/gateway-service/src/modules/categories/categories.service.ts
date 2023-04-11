import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { CoreBrokerPatterns } from 'shared-const';

@Injectable()
export class CategoriesService {
  constructor(private coreService: CoreService) {}

  async getBusinessCategories(payload) {
    const pattern = { cmd: CoreBrokerPatterns.GetBusinessCategories };

    return this.coreService.sendCustom(pattern, payload);
  }
}
