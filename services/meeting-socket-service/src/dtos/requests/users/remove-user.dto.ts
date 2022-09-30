import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class RemoveUserRequestDTO implements Partial<ICommonMeetingUserDTO> {
  id: ICommonMeetingUserDTO['id'];
}
