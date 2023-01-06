import {Global, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// controllers
import { MeetingsController } from './meetings.controller';

// services
import { MeetingsService } from './meetings.service';
import { ConfigClientService } from '../../services/config/config.service';

// modules
import { ConfigModule } from '../../services/config/config.module';
import { MediaServerModule } from '../../services/media-server/media-server.module';
import { ScalingModule } from '../../services/scaling/scaling.module';

// const
import { JWT_ACCESS_EXPIRE } from 'shared-const';


@Global()
@Module({
  imports: [
    MediaServerModule,
    ScalingModule,
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
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
