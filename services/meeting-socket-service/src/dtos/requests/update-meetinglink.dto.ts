import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeetingLinkRequestDTO {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  meetingId: string;

  @IsNotEmpty({
    message: 'url is empty',
  })
  @IsString({
    message: 'url.invalid',
  })
  url: string;

  @IsNotEmpty()
  @IsString({
    message: 'Invalid userId',
  })
  userId: string;
}
