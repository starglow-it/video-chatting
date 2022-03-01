import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { CoreModule } from '../core/core.module';
import { TemplatesService } from './templates.service';

@Module({
  imports: [CoreModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
