import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { CoreBrokerPatterns } from 'shared-const';
import { CreateMediaCategoryPayload, CreateUserTemplateMediaPayload, GetMediaCategoriesPayload, GetMediasPayload, GetUserTemplateMediasPayload, UploadMediaCategoryFile, UploadUserTemplateMediaFilePayload } from 'shared-types';

@Injectable()
export class MediasService {
  constructor(private coreService: CoreService) {}

  async getMediaCategories(payload: GetMediaCategoriesPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetMediaCategories };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createMediaCategory(payload: CreateMediaCategoryPayload){
    const pattern = { cmd: CoreBrokerPatterns.CreateMediaCategory };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getMedias(payload: GetMediasPayload){
    const pattern = { cmd: CoreBrokerPatterns.GetMedias };

    return this.coreService.sendCustom(pattern, payload); 
  }


  async getUserTemplateMedias(payload: GetUserTemplateMediasPayload){
    console.log(payload);
    
    const pattern = { cmd: CoreBrokerPatterns.GetUserTemplateMedias };

    return this.coreService.sendCustom(pattern, payload); 
  }

  async createUserTemplateMedia(payload: CreateUserTemplateMediaPayload){
    const pattern = { cmd: CoreBrokerPatterns.CreateUserTemplateMedia };

    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadUserTemplateMediaFile(payload: UploadUserTemplateMediaFilePayload){
    const pattern = { cmd: CoreBrokerPatterns.UploadUserTemplateMediaFile };
    console.log(payload);
    
    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadMediaCategoryFile(payload: UploadMediaCategoryFile){
    const pattern = { cmd: CoreBrokerPatterns.UploadMediaCategoryFile };
    
    return this.coreService.sendCustom(pattern, payload);
  }

}
