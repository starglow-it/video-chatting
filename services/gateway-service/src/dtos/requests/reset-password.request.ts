import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequest {
  @IsNotEmpty({
    message: 'Token must be present',
  })
  @IsString({
    message: 'Invalid token value',
  })
  @ApiProperty()
  readonly token: string;

  @IsNotEmpty({
    message: 'newPassword must be present',
  })
  @IsString({
    message: 'Invalid newPasswordRepeat value',
  })
  @ApiProperty()
  readonly newPassword: string;

  @IsNotEmpty({
    message: 'newPasswordRepeat must be present',
  })
  @IsString({
    message: 'Invalid newPasswordRepeat value',
  })
  @ApiProperty()
  readonly newPasswordRepeat: string;
}
