import { Injectable } from '@nestjs/common';
import { InjectS3 } from 'nestjs-s3';
import { S3 } from 'aws-sdk';
import { ConfigClientService } from '../../services/config/config.service';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigClientService,
    @InjectS3() private readonly s3: S3,
  ) {}

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

  async deleteFolder(keyFolder: string) {
    const bucket = await this.configService.get('vultrUploadBucket');
    const objects = await this.s3
      .listObjects({
        Bucket: bucket,
        Prefix: keyFolder,
      })
      .promise();
    await this.s3
      .deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: objects.Contents?.map(({ Key }) => ({ Key })) ?? [],
        },
      })
      .promise();
    return this.s3
      .deleteObject({
        Bucket: bucket,
        Key: keyFolder,
      })
      .promise();
  }
}
