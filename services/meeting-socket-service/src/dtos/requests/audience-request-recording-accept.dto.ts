import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAudienceRequestRecordingAccept } from 'src/interfaces/audience-request-recording-accept.interface';
export class AudienceRequestRecordingAccept implements IAudienceRequestRecordingAccept {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  recordingUrl: string;
}
