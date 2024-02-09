import { IsString } from 'class-validator';
import { IRemoveMeetingReaction } from '../../../interfaces/remove-meeting-reaction.interface';

export class RemoveMeetingReactionRequestDTO implements IRemoveMeetingReaction {
  @IsString()
  reactionId: string;
}
