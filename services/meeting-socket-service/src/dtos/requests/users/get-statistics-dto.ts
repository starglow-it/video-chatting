import { IsOptional, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class GetStatisticsDTO {
  @IsOptional()
  @IsString({
    message: 'Invalid meeting id',
  })
  meetingId: string;
  
  @IsOptional()
  @IsString({
    message: 'Invalid id',
  })
  profileId: ICommonMeetingUserDTO['id'];
}