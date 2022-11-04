import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IMeetingInstance, ICommonUser } from 'shared-types';

export class CommonInstanceMeetingRestDTO implements IMeetingInstance {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  serverIp: IMeetingInstance['serverIp'];

  @Expose()
  @ApiProperty()
  template: string;

  @Expose()
  @ApiProperty()
  owner: ICommonUser['id'];

  @Expose()
  @ApiProperty()
  serverStatus: IMeetingInstance['serverStatus'];

  @Expose()
  @ApiProperty()
  instanceId: IMeetingInstance['instanceId'];

  snapshotId: IMeetingInstance['snapshotId'];
}
