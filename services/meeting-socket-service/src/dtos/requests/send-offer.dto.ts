import { IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class SendOfferRequestDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsString()
  sdp: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  connectionId: string;

  @IsNotEmpty()
  @IsString()
  socketId: string;
}
