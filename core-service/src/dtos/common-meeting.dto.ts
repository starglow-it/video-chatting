import { Expose, Transform, Type } from 'class-transformer';

import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

import { CommonUserDTO } from './common-user.dto';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { UserTemplateDTO } from './user-template.dto';

export class CommonMeetingDTO implements ICommonMeetingInstanceDTO {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  serverIp: string;

  @Expose()
  meetingToken: string;

  @Expose()
  @Type(() => UserTemplateDTO)
  @Transform((data) => data.obj.template['_id']?.toString())
  template: IUserTemplate['id'];

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data.obj.owner['_id']?.toString())
  owner: ICommonUserDTO['id'];

  @Expose()
  serverStatus: string;
}
