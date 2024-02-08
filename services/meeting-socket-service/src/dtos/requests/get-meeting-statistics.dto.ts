import { IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';

export class GetMeetingStatisticsRequestDTO {
  @IsOptional()
  @IsString({
    message: 'meeting.invalid',
  })
  meetingId?: string;

  @ValidateNested({
    message: 'Invalid user id',
  })
  userId: string;
}
