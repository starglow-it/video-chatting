import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentials, RegisterType } from 'shared-types';

export class SeatUserCredentialsRequest implements IUserCredentials {
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
    message: 'profileId.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly profileId: string;

  @IsString({
    message: 'hostId.invalid',
  })
  @IsNotEmpty()
  @ApiProperty()
  readonly hostId: string;

  @IsString({
    message: 'user.country.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly country: string;

  @IsString({
    message: 'user.state.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly state: string;
}
