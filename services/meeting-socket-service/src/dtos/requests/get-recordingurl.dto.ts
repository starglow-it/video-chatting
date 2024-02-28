import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IGetRecordingUrlRequest } from 'src/interfaces/get-recordingurl.interface';
export class GetRecordingUrlRequest implements IGetRecordingUrlRequest {
  @IsNotEmpty()
  @IsString()
  meetingId: string;
}
