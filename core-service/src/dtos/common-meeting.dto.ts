import { Expose, Transform, Type } from 'class-transformer';

import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

import { CommonUserDTO } from './common-user.dto';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

export class CommonMeetingDTO implements ICommonMeetingInstanceDTO {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  serverIp: string;

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data?.obj?.owner?.['_id']?.toString())
  owner: ICommonUserDTO['id'];

  @Expose()
  serverStatus: string;
}
