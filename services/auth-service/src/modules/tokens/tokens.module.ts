import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { ConfirmTokenModule } from './confirm-token/confirm-token.module';

@Module({
  imports: [
    RefreshTokenModule,
    ResetPasswordTokenModule,
    AccessTokenModule,
    ConfirmTokenModule,
  ],
  controllers: [],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
