import { Module } from '@nestjs/common';
import { TranscodeController } from './transcode.controller';
import { TranscodeService } from './transcode.service';
import { AwsConnectorModule } from '../../services/aws-connector/aws-connector.module';

@Module({
    imports: [AwsConnectorModule],
    controllers: [TranscodeController],
    providers: [TranscodeService],
    exports: [TranscodeService],
})
export class TranscodeModule {}
