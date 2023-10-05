import { IsNotEmpty, IsString } from 'class-validator';
import { MeetingRole, Timestamp } from 'shared-types';
import { IsTimestamp } from '../../utils/decorators/validators/isTimestamp';

export class ScheduleRequestDto {
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @IsNotEmpty()
  @IsTimestamp()
  startAt: Timestamp;

  @IsNotEmpty()
  @IsTimestamp()
  endAt: Timestamp;

  @IsNotEmpty()
  timeZone: string;

  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  role: MeetingRole.Participant | MeetingRole.Lurker;

  @IsNotEmpty()
  userEmails: string[];
}
