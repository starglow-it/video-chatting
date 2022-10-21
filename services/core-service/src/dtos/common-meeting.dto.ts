import { Expose, Transform, Type } from 'class-transformer';

import { ICommonMeetingInstance } from 'shared';

import { CommonUserDTO } from './common-user.dto';
import { ICommonUserDTO } from 'shared';

export class CommonMeetingDTO implements ICommonMeetingInstance {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  serverIp: ICommonMeetingInstance['serverIp'];

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data?.obj?.owner?.['_id']?.toString())
  owner: ICommonUserDTO['id'];

  @Expose()
  serverStatus: ICommonMeetingInstance['serverStatus'];

  @Expose()
  instanceId: ICommonMeetingInstance['instanceId'];

  @Expose()
  snapshotId: ICommonMeetingInstance['snapshotId'];
}
