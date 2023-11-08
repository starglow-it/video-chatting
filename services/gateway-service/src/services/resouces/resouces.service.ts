import { Injectable } from '@nestjs/common';
import { CoreBrokerPatterns } from 'shared-const';
import { IResouce, UploadResoucePayload } from 'shared-types';
import { UploadService } from '../../modules/upload/upload.service';
import { CoreService } from '../core/core.service';

@Injectable()
export class ResouceService {
  constructor(
    private readonly coreService: CoreService,
    private readonly uploadService: UploadService,
  ) {}

  private async createResouce(): Promise<IResouce> {
    const pattern = { cmd: CoreBrokerPatterns.CreateResouce };
    return this.coreService.sendCustom(pattern, {});
  }

  async uploadResouce(payload: UploadResoucePayload) {
    const pattern = { cmd: CoreBrokerPatterns.UploadResouce };
    return this.coreService.sendCustom(pattern, payload);
  }

  async handleCreateResouce({
    file,
  }: {
    file: Express.Multer.File;
  }): Promise<IResouce> {
    let resouce = await this.createResouce();
    if (file) {
      const type = file.mimetype.includes('audio') ? 'sound' : 'video';
      const url = await this.uploadService.handleUploadCommonFile({
        file,
        folderKey: `resouces/${resouce.id}/${type}`,
      });

      resouce = await this.uploadResouce({
        url,
        id: resouce.id,
        mimeType: file.mimetype,
        size: file.size,
        key: `http://${this.uploadService.vultrStorageHostname}/`,
      });
    }

    return resouce;
  }
}
