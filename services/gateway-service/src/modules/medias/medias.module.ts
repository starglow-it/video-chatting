import { Module } from '@nestjs/common';
import { CoreModule } from '../../services/core/core.module';
import { UploadModule } from '../upload/upload.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/services/config/config.module';
import { ConfigClientService } from 'src/services/config/config.service';
import { JWT_ACCESS_EXPIRE } from 'shared-const';

@Module({
  imports: [
    CoreModule,
    UserTemplatesModule,
    UploadModule,
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
  providers: [MediasService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
