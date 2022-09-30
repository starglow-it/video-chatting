import { Module } from '@nestjs/common';
import { VultrService } from './vultr.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [VultrService],
  controllers: [],
  exports: [VultrService],
})
export class VultrModule {}
