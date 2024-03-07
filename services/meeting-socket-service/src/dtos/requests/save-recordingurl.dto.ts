import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ISaveRecordingUrlRequest } from 'src/interfaces/save-recordingurl.interface';
export class SaveRecordingUrlRequest implements ISaveRecordingUrlRequest {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsString()
  url: string;
}
