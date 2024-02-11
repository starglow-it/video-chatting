import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdateMeetingLinkRequestDTO {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly url: string;

  @IsNotEmpty()
  @IsString({
    message: 'Invalid userId',
  })
  readonly userId: string;
}
