import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IGetRecordingUrls } from 'src/interfaces/get-recording-urls.interface';
export class GetRecordingUrlsDto implements IGetRecordingUrls {
  @IsNotEmpty()
  @IsString()
  profileId: string;
}
