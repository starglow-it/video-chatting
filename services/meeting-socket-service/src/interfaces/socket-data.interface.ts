import { MeetingUserDocument } from 'src/schemas/meeting-user.schema';

export type SocketData = Partial<{
  user: MeetingUserDocument;
  error: any;
}>;
