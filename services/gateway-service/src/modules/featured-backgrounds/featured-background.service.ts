import { Injectable } from '@nestjs/common';
import { CoreBrokerPatterns } from 'shared-const';
import { CreateFeaturedBackgroundPayload, DeleteFeaturedBackgroundPayload, GetFeaturedBackgroundPayload, IMedia, UploadFeaturedBackgroundPayload } from 'shared-types';
import { CoreService } from '../../services/core/core.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class FeaturedBackgroundService {
  constructor(
    private coreService: CoreService,
    private uploadService: UploadService,
  ) { }

  async createFeatureBackground(payload: CreateFeaturedBackgroundPayload) {
    const pattern = { cmd: CoreBrokerPatterns.CreateFeaturedBackground };
    return this.coreService.sendCustom(pattern, payload);
  }

  async uploadFeatureBackgroundFile(payload: UploadFeaturedBackgroundPayload) {
    const pattern = { cmd: CoreBrokerPatterns.UploadFeaturedBackgroundFile };

    return this.coreService.sendCustom(pattern, payload);
  }

  async deleteFeaturedBackground(payload: DeleteFeaturedBackgroundPayload): Promise<boolean> {
    const pattern = { cmd: CoreBrokerPatterns.DeleteFeatureBackground };
    return this.coreService.sendCustom(pattern, payload);
  }

  async handleUploadBackground({ file, userId }: { file: Express.Multer.File, userId: string }): Promise<IMedia> {
    let featuredBackground = await this.createFeatureBackground({ userId });
    if (file) {
      const url = await this.uploadService.handleUploadCommonFile({
        file,
        folderKey: `featured-backgrounds/${featuredBackground.id}/videos`,
      });

      featuredBackground = await this.uploadFeatureBackgroundFile({
        url,
        id: featuredBackground.id,
        mimeType: file.mimetype,
      });
    }

    return featuredBackground;
  }

  async getFeatureBackground(payload: GetFeaturedBackgroundPayload) {
    const pattern = { cmd: CoreBrokerPatterns.GetFeaturedBackground };

    return this.coreService.sendCustom(pattern, payload);
  }


}
