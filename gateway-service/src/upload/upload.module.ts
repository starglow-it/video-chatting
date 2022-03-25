import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';

import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

import { UploadController } from './upload.controller';

import { UploadService } from './upload.service';
import { ConfigClientService } from '../config/config.service';

import { ConfigModule } from '../config/config.module';

import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    CoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => {
        return {
          secret: await config.get('jwtSecret'),
          signOptions: { expiresIn: JWT_ACCESS_EXPIRE },
        };
      },
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (
        config: ConfigClientService,
      ): Promise<S3ModuleOptions> => {
        const allConfig = await config.getAll();

        return {
          config: {
            accessKeyId: allConfig.accessKey,
            secretAccessKey: allConfig.secretAccessKey,
            endpoint: `https://${allConfig.storageHostname}`,
            s3ForcePathStyle: true,
          },
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
