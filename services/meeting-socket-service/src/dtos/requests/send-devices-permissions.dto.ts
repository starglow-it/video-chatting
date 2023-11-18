import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SendDevicesPermissionsRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  audio: boolean;

  @IsNotEmpty()
  @IsBoolean()
  video: boolean;
}
