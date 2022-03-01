import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';

import { ConfigClientService } from '../config/config.service';

@Injectable()
export class AwsConnectorService {
  constructor(
    private configService: ConfigClientService,
    @InjectS3() private readonly s3: S3,
  ) {}

  async deleteResource(key: string) {
    const uploadBucket = await this.configService.get('uploadBucket');

    return this.s3
      .deleteObject({
        Bucket: uploadBucket,
        Key: key,
      })
      .promise();
  }
}
