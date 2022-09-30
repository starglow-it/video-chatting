import { ICommonMeetingInstance } from '@shared/interfaces/common-instance-meeting.interface';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

export class CommonInstanceMeetingRestDTO implements ICommonMeetingInstance {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  serverIp: ICommonMeetingInstance['serverIp'];

  @Expose()
  @ApiProperty()
  template: string;

  @Expose()
  @ApiProperty()
  owner: ICommonUserDTO['id'];

  @Expose()
  @ApiProperty()
  serverStatus: ICommonMeetingInstance['serverStatus'];

  @Expose()
  @ApiProperty()
  instanceId: ICommonMeetingInstance['instanceId'];

  snapshotId: ICommonMeetingInstance["snapshotId"];
}
