import {Global, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';

import { JWT_ACCESS_EXPIRE } from 'shared-const';

import { UploadController } from './upload.controller';

import { UploadService } from './upload.service';
import { ConfigClientService } from '../../services/config/config.service';

import { ConfigModule } from '../../services/config/config.module';

@Global()
@Module({
  imports: [
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
            accessKeyId: allConfig.vultrAccessKey,
            secretAccessKey: allConfig.vultrSecretAccessKey,
            endpoint: `https://${allConfig.vultrStorageHostname}`,
            s3ForcePathStyle: true,
          },
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
