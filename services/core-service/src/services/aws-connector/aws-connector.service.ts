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
    const vultrUploadBucket = await this.configService.get<string>('vultrUploadBucket');

    return new Promise((resolve, reject) => {
      this.s3
          .deleteObject({
            Bucket: vultrUploadBucket,
            Key: key,
          }, (err, data) => {
            if (err) {
              reject(err);
            }
            resolve(data);
          })
    });
  }

  async uploadFile(fileData: Buffer, key: string): Promise<string> {
    const Bucket = await this.configService.get('vultrUploadBucket');

    const params = {
      Bucket,
      Key: key,
      Body: fileData,
      ACL: 'public-read',
    } as S3.Types.PutObjectRequest;

    const response = await this.s3.upload(params).promise();

    if (!/^https:\/\/*/.test(response.Location)) {
      return `https://${response.Location}`;
    }

    return response.Location;
  }
}
