import { IsOptional, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class getUsersDTO {
  @IsString({
    message: 'Invalid Meeting id',
  })
  id: ICommonMeetingUserDTO['id'];
}
