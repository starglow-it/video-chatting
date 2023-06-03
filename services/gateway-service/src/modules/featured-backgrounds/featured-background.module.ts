import { Module } from '@nestjs/common';
import { FeaturedBackgroundController } from './featured-background.controller';
import { FeaturedBackgroundService } from './featured-background.service';
import { CoreModule } from '../../services/core/core.module';
import { UploadModule } from '../upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../services/config/config.module';
import { ConfigClientService } from '../../services/config/config.service';
import { JWT_ACCESS_EXPIRE } from 'shared-const';

@Module({
  controllers: [FeaturedBackgroundController],
  providers: [FeaturedBackgroundService],
  imports: [CoreModule, UploadModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigClientService],
    useFactory: async (config: ConfigClientService) => {
      return {
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_ACCESS_EXPIRE },
      };
    },
  }),],
  exports: [FeaturedBackgroundService]
})
export class FeaturedBackgroundModule { }
