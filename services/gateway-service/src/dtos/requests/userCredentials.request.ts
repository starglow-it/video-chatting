import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentials, RegisterType } from 'shared-types';

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

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString({
    message: 'user.registerType.invalid',
  })
  registerType: RegisterType;

  @IsString({
    message: 'user.country.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly country: string;
}
