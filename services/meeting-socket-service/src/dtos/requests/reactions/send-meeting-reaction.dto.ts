import { IsString, MaxLength } from 'class-validator';
import { ISendMeetingReaction } from '../../../interfaces/send-meeting-reaction.interface';

export class SendMeetingReactionRequestDTO implements ISendMeetingReaction {
  @IsString()
  @MaxLength(500)
  emojiName: string;
}
