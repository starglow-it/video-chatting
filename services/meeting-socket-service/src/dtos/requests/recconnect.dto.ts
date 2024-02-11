import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IReconnect } from '../../interfaces/reconnect.interface';

export class ReconnectDto implements IReconnect {
  @IsOptional()
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  meetingUserId?: string;
}
