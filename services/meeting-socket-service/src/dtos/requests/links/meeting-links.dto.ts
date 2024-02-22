import { IsNotEmpty, IsString } from 'class-validator';

export class MeetingLinksDTO {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  meetingUserId: string;

  @IsNotEmpty()
  @IsString()
  linkId: string;
}
