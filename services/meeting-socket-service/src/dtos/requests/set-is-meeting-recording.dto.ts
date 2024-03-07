import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ISetIsMeetingRecordingRequest } from 'src/interfaces/set-is-meeting-recording.interface';
export class SetIsMeetingRecordingRequest implements ISetIsMeetingRecordingRequest {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsBoolean()
  isMeetingRecording: boolean;

  @IsOptional()
  @IsString()
  recordingUrl: string;
}
