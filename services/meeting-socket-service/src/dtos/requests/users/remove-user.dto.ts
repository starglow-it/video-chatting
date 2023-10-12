import { IsNotEmpty, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class RemoveUserRequestDTO implements Partial<ICommonMeetingUserDTO> {
  @IsNotEmpty()
  @IsString({
    message: 'Invalid id',
  })
  id: ICommonMeetingUserDTO['id'];
}
