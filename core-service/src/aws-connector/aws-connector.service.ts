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

  async uploadFile(fileData: Buffer, key: string): Promise<string> {
    const Bucket = await this.configService.get('uploadBucket');

    const params = {
      Bucket,
      Key: key,
      Body: fileData,
      ACL: 'public-read',
    } as S3.Types.PutObjectRequest;

    const response = await this.s3.upload(params).promise();

    return response.Location;
  }
}
