import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IToken } from '@shared/interfaces/token.interface';

export class TokenRequest implements IToken {
  @IsNotEmpty({
    message: 'Token must be present',
  })
  @IsString({
    message: 'Invalid token value',
  })
  @ApiProperty()
  readonly token: string;
}
