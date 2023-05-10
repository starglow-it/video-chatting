import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { CoreBrokerPatterns } from 'shared-const';
import {
  CreateMediaCategoryPayload,
  CreateMediaPayload,
  DeleteMediaCategoriesPayload,
  DeleteMediasPayload,
  GetAdminMediaCategoriesPayload,
  GetMediaCategoriesPayload,
  GetMediasPayload,
  IMedia,
  UpdateMediaCategoryPayload,
  UploadMediaCategoryFile,
  UploadMediaFilePayload,
} from 'shared-types';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MediasService {
  constructor(
    private coreService: CoreService,
    private uploadService: UploadService,
  ) { }

  async getMediaCategories(payload: GetMediaCategoriesPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetMediaCategories };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getAdminMediaCategories(payload: GetAdminMediaCategoriesPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetAdminMediaCategories };
    return this.coreService.sendCustom(pattern, payload);
  }

  async createMediaCategory(payload: CreateMediaCategoryPayload) {
    const pattern = { cmd: CoreBrokerPatterns.CreateMediaCategory };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getMedias(payload: GetMediasPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetMedias };

    return this.coreService.sendCustom(pattern, payload);
  }

  async createMedia(payload: CreateMediaPayload) {
    const pattern = { cmd: CoreBrokerPatterns.CreateMedia };

    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadMediaFile(payload: UploadMediaFilePayload) {
    const pattern = { cmd: CoreBrokerPatterns.UploadMediaFile };

    return this.coreService.sendCustom(pattern, payload);
  }


  async updateMediaCategory(payload: UpdateMediaCategoryPayload) {
    const pattern = { cmd: CoreBrokerPatterns.UpdateMediaCategory };

    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadMediaCategoryFile(payload: UploadMediaCategoryFile) {
    const pattern = { cmd: CoreBrokerPatterns.UploadMediaCategoryFile };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteMedias(payload: DeleteMediasPayload): Promise<boolean> {
    const pattern = { cmd: CoreBrokerPatterns.DeleteMedias };
    return this.coreService.sendCustom(pattern, payload);
  }


  async deleteMediaCategories(payload: DeleteMediaCategoriesPayload): Promise<boolean> {
    const pattern = { cmd: CoreBrokerPatterns.DeleteMediaCategories };
    return this.coreService.sendCustom(pattern, payload);
  }

  async handleCreateMedia({ file, body }: { file: Express.Multer.File, body: CreateMediaPayload }): Promise<IMedia> {
    let media = await this.createMedia(body);
    if (file) {
      const url = await this.uploadService.handleUploadCommonFile({
        file,
        folderKey: `medias/${media.id}/videos`
      });

      media = await this.uploadMediaFile({
        url,
        id: media.id,
        mimeType: file.mimetype,
      });
    }

    return media;
  }

}
