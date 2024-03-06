import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { IDeleteRecordingVideoDto } from 'src/interfaces/delete-recording-video.interface';
export class DeleteRecordingVideoDto implements IDeleteRecordingVideoDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
