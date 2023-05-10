import { Injectable } from '@nestjs/common';
import { InjectS3 } from 'nestjs-s3';
import { S3 } from 'aws-sdk';
import { ConfigClientService } from '../../services/config/config.service';
import { getFileNameAndExtension } from 'src/utils/getFileNameAndExtension';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  vultrUploadBucket: string;
  vultrStorageHostname: string;

  constructor(
    private configService: ConfigClientService,
    @InjectS3() private readonly s3: S3,
  ) { }

  async onModuleInit() {
    this.vultrUploadBucket = await this.configService.get<string>(
      'vultrUploadBucket',
    );
    this.vultrStorageHostname = await this.configService.get<string>(
      'vultrStorageHostname',
    );
  }

  getUploadKeyFromUrl(url) {
    return url.replace(
      `https://${this.vultrStorageHostname}/${this.vultrUploadBucket}/`,
      '',
    );
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

  async handleUploadCommonFile({
    file,
    folderKey
  }: {
    file: Express.Multer.File,
    folderKey: string
  }) {
    const { extension } = getFileNameAndExtension(file.originalname);
    const uploadKey = `${folderKey}/${uuidv4()}.${extension}`;

    await this.deleteFolder(folderKey);

    let url = await this.uploadFile(file.buffer, uploadKey);

    return url;
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
}
