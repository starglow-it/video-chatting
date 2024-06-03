import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentials } from 'shared-types';

export class SeatLoginRequest implements IUserCredentials {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Please enter email',
  })
  @IsString({
    message: 'user.invalid',
  })
  @ApiProperty()
  readonly email: string;

  @MinLength(8, {
    message: 'user.pass.length',
  })
  @IsString({
    message: 'user.pass.invalid',
  })
  @IsNotEmpty({
    message: 'user.pass.empty',
  })
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty({
    message: 'Please enter host id',
  })
  @IsString({
    message: 'hostId.invalid',
  })
  @ApiProperty()
  readonly hostId: string;
}
