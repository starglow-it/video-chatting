import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// controllers
import { UserTokenController } from './user-token.controller';

// services
import { UserTokenService } from './user-token.service';

// schemas
import { UserToken, UserTokenSchema } from '../schemas/user-token.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: UserToken.name,
        schema: UserTokenSchema,
      },
    ]),
  ],
  controllers: [UserTokenController],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
