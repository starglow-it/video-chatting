import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateProfileAvatar } from '@shared/interfaces/update-profile-avatar.interface';

export class UpdateProfileAvatarRequest implements IUpdateProfileAvatar {
  @IsNotEmpty({
    message: 'Profile Avatar must be present',
  })
  @IsString({
    message: 'Invalid Profile Avatar value',
  })
  @ApiProperty()
  readonly profileAvatar: string;

  @IsNotEmpty({
    message: 'Size must be present',
  })
  @IsNumber(
    {},
    {
      message: 'Invalid Size value',
    },
  )
  @ApiProperty()
  readonly size: number;

  @IsNotEmpty({
    message: 'Mime Type must be present',
  })
  @IsString({
    message: 'Invalid Mime Type value',
  })
  @ApiProperty()
  readonly mimeType: string;
}
