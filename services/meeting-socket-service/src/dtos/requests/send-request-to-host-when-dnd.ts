import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ISendRequestToHostWhenDnd } from 'src/interfaces/send-request-to-host-when-dnd';
export class SendRequestToHostWhenDnd implements ISendRequestToHostWhenDnd {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
