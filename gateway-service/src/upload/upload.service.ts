import { Injectable } from '@nestjs/common';
import { InjectS3 } from 'nestjs-s3';
import { S3 } from 'aws-sdk';
import { ConfigClientService } from '../config/config.service';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigClientService,
    @InjectS3() private readonly s3: S3,
  ) {}

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
