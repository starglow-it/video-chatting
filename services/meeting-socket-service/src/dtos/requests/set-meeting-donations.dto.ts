import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ISetMeetingDonations } from 'src/interfaces/set-meeting-donations.interface';
export class SetMeetingDonations implements ISetMeetingDonations {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  meetingRole: string;

  @IsOptional()
  @IsNumber()
  price: number
}
