import { Expose, Transform, Type } from 'class-transformer';

import { IMeetingInstance, ICommonUser } from 'shared-types';

import { CommonUserDTO } from './common-user.dto';

export class CommonMeetingDTO implements IMeetingInstance {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  serverIp: IMeetingInstance['serverIp'];

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data?.obj?.owner?.['_id']?.toString())
  owner: ICommonUser['id'];

  @Expose()
  serverStatus: IMeetingInstance['serverStatus'];

  @Expose()
  instanceId: IMeetingInstance['instanceId'];

  @Expose()
  snapshotId: IMeetingInstance['snapshotId'];

  @Expose()
  startAt: string;

  @Expose()
  aboutTheHost: string;

  @Expose()
  content: string;
}
