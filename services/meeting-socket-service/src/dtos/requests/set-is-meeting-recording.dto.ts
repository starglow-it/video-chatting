import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ISetIsMeetingRecordingRequest } from 'src/interfaces/set-is-meeting-recording.interface';
import { isBoolean } from 'util';
export class SetIsMeetingRecordingRequest implements ISetIsMeetingRecordingRequest {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsBoolean()
  isMeetingRecording: boolean;

  @IsNotEmpty()
  @IsString()
  recordingUrl: string;
}
