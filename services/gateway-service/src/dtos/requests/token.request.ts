import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IToken } from 'shared-types';

export class TokenRequest implements Omit<IToken, 'expiresAt'> {
  @IsNotEmpty({
    message: 'Token must be present',
  })
  @IsString({
    message: 'Invalid token value',
  })
  @ApiProperty()
  readonly token: string;
}
