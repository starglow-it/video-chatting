import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ISendContactsInfo } from 'shared';

export class SendContactsInfoRequest implements ISendContactsInfo {
  @IsNotEmpty({
    message: 'Email must be present',
  })
  @IsString({
    message: 'Invalid email value',
  })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({
    message: 'Name must be present',
  })
  @IsString({
    message: 'Invalid name value',
  })
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty({
    message: 'Message must be present',
  })
  @IsString({
    message: 'Invalid message value',
  })
  @ApiProperty()
  readonly message: string;
}
