import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// shared
import { JWT_ACCESS_EXPIRE } from 'shared-const';

// controllers
import { UserTemplatesController } from './user-templates.controller';

// service
import { UserTemplatesService } from './user-templates.service';
import { ConfigClientService } from '../../services/config/config.service';

// module
import { CoreModule } from '../../services/core/core.module';
import { TemplatesModule } from '../templates/templates.module';
import { ConfigModule } from '../../services/config/config.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    CoreModule,
    TemplatesModule,
    PassportModule,
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
  controllers: [UserTemplatesController],
  providers: [UserTemplatesService],
  exports: [UserTemplatesService],
})
export class UserTemplatesModule {}
