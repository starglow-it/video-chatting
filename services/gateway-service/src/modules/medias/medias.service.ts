import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { CoreBrokerPatterns } from 'shared-const';
import { GetMediaCategoriesPayload, GetMediasPayload } from 'shared-types';

@Injectable()
export class MediasService {
  constructor(private coreService: CoreService) {}

  async getMediaCategories(payload: GetMediaCategoriesPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetMediaCategories };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getMedias(payload: GetMediasPayload){
    const pattern = { cmd: CoreBrokerPatterns.GetMedias };

    return this.coreService.sendCustom(pattern, payload); 
  }

}
