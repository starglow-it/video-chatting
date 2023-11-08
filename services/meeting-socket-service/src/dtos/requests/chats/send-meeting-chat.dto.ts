import { IsNotEmpty, IsString } from 'class-validator';

export class SendMeetingChatRequestDto {
  @IsNotEmpty()
  @IsString({
    message: 'Invalid string',
  })
  body: string;
}
