import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

export class CommonInstanceMeetingRestDTO implements ICommonMeetingInstanceDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  serverIp: string;

  @Expose()
  @ApiProperty()
  template: string;

  @Expose()
  @ApiProperty()
  owner: ICommonUserDTO['id'];

  @Expose()
  @ApiProperty()
  serverStatus: string;
}
