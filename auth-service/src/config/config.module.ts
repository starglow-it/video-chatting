import { Module, Global } from '@nestjs/common';
import { ConfigClientService } from './config.service';

@Global()
@Module({
  imports: [],
  providers: [ConfigClientService],
  exports: [ConfigClientService],
})
export class ConfigModule {}
