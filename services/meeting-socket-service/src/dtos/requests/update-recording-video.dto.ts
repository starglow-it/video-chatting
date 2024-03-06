import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { IUpdateRecordingVideo } from 'src/interfaces/update-recording-video.interface';
export class UpdateRecordingVideo implements IUpdateRecordingVideo {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
