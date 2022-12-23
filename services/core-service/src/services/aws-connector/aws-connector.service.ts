import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';

import { ConfigClientService } from '../config/config.service';
import { GetObjectRequest } from 'aws-sdk/clients/s3';
import * as stream from 'stream';

@Injectable()
export class AwsConnectorService {
  private readonly logger = new Logger();

  vultrUploadBucket: string;

  constructor(
    private configService: ConfigClientService,
    @InjectS3() private readonly s3: S3,
  ) {}

  async onModuleInit() {
    this.vultrUploadBucket = await this.configService.get<string>(
      'vultrUploadBucket',
    );
  }

  async getResource(key: string) {
    const params: GetObjectRequest = {
      Bucket: this.vultrUploadBucket,
      Key: key,
    };

    return new Promise((res, rej) => {
      this.s3.getObject(params, (err, data) => {
        if (err) {
          rej(err.message);
        }
        res(data);
      });
    });
  }

  async deleteResource(key: string) {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: this.vultrUploadBucket,
          Key: key,
        },
        (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }

  async uploadFile(fileData: Buffer, key: string): Promise<string> {
    const params = {
      Bucket: this.vultrUploadBucket,
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

  async uploadStreamFile(
    fileData: stream.PassThrough,
    key: string,
  ): Promise<string> {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.vultrUploadBucket,
      Key: key,
      Body: fileData,
      ACL: 'public-read',
    };

    try {
      const response = await this.s3.upload(params).promise();

      if (!/^https:\/\/*/.test(response.Location)) {
        return `https://${response.Location}`;
      }

      return response.Location;
    } catch (e) {
      this.logger.error(e.message);

      return '';
    }
  }

  async deleteFolder(keyFolder: string) {
    const params = {
      Bucket: this.vultrUploadBucket,
      Prefix: keyFolder,
    } as S3.Types.ListObjectsRequest;

    const objects = await this.s3.listObjects(params).promise();

    await this.s3
      .deleteObjects({
        Bucket: this.vultrUploadBucket,
        Delete: {
          Objects: objects.Contents?.map(({ Key }) => ({ Key })) ?? [],
        },
      })
      .promise();

    return this.s3
      .deleteObject({
        Bucket: this.vultrUploadBucket,
        Key: keyFolder,
      })
      .promise();
  }
}
