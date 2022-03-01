import { Module } from '@nestjs/common';
import { AwsConnectorController } from './aws-connector.controller';
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
            accessKeyId: allConfig.accessKey,
            secretAccessKey: allConfig.secretAccessKey,
            endpoint: `https://${allConfig.storageHostname}`,
            s3ForcePathStyle: true,
          },
        };
      },
    }),
  ],
  controllers: [AwsConnectorController],
  providers: [AwsConnectorService],
  exports: [AwsConnectorService],
})
export class AwsConnectorModule {}
