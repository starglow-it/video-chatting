import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IGetRecordingUrlById } from 'src/interfaces/get-recording-url-by-id.interface';
export class GetRecordingUrlById implements IGetRecordingUrlById {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  videoId: string;
}
