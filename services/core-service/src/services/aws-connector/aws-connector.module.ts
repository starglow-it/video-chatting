import { Module } from '@nestjs/common';
import { AwsConnectorService } from './aws-connector.service';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule,
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
  controllers: [],
  providers: [AwsConnectorService],
  exports: [AwsConnectorService],
})
export class AwsConnectorModule {}
