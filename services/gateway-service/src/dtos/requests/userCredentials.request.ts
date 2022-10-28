import {IsNotEmpty, IsString, IsEmail, MinLength, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentials } from 'shared';

export class UserCredentialsRequest implements IUserCredentials {
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

  @IsString({
    message: 'user.country.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly country: string;
}
