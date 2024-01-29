import { IsNotEmpty, IsString } from 'class-validator';

export class SendMeetingQuestionRequestDto {
  @IsNotEmpty()
  @IsString({
    message: 'Invalid string',
  })
  body: string;
}
