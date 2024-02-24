import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAudienceRequestRecording } from 'src/interfaces/audience-request-recording.interface';
export class AudienceRequestRecording implements IAudienceRequestRecording {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  meetingAvatarId: string;
}
