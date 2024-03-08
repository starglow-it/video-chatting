import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ISaveRecordingUrlRequest } from 'src/interfaces/save-recordingurl.interface';
export class SaveRecordingUrlRequest implements ISaveRecordingUrlRequest {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsOptional()
  @IsString()
  url: string;
}
