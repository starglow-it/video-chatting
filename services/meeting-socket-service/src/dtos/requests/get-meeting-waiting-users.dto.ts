import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { GetMeetingWaitingUser } from 'src/interfaces/get-meeting-waiting-user';
export class GetMeetingWaitingUsersDto implements GetMeetingWaitingUser {
  @IsNotEmpty()
  @IsArray()
  users: string[];
}
