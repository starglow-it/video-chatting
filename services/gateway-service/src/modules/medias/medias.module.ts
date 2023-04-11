import { Module } from '@nestjs/common';
import { CoreModule } from '../../services/core/core.module';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

@Module({
  imports: [CoreModule],
  providers: [MediasService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
