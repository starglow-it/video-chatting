import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional, IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentials } from 'shared-types';

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

  @IsMongoId()
  @IsString()
  @IsNotEmpty({
    message: 'user.templateId.empty',
  })
  @ApiProperty()
  readonly templateId: string;

  @IsString({
    message: 'user.country.invalid',
  })
  @IsOptional()
  @ApiProperty()
  readonly country: string;
}
