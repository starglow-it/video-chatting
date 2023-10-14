import { IsNotEmpty, IsString } from 'class-validator';

export class SendIceCandidateRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  connectionId: string;

  @IsNotEmpty()
  @IsString()
  candidate: unknown;

  @IsNotEmpty()
  @IsString()
  socketId: string;
}
