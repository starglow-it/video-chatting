import { MeetingAccessStatusEnum } from 'shared-types';
import { MeetingEmitEvents } from '../const/socket-events/emitters';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';
import { userSerialization } from '../dtos/response/common-user.dto';
import { MeetingDocument } from '../schemas/meeting.schema';
import { TEventEmitter } from '../types/socket-events';

export const notifyParticipantsMeetingInfo = async ({
  meeting,
  emitToRoom,
}: {
  emitToRoom: (...args: TEventEmitter) => void;
  meeting: MeetingDocument;
}) => {
  const meetingUsers = meeting.users.filter(
    (u) => u.accessStatus === MeetingAccessStatusEnum.InMeeting,
  );

  const plainUsers = userSerialization(meetingUsers);
  const plainMeeting = meetingSerialization(meeting);

  emitToRoom(
    `waitingRoom:${meeting.templateId}`,
    MeetingEmitEvents.UpdateMeeting,
    {
      meeting: plainMeeting,
      users: plainUsers,
    },
  );

  emitToRoom(`meeting:${plainMeeting.id}`, MeetingEmitEvents.UpdateMeeting, {
    meeting: plainMeeting,
    users: plainUsers,
  });
};
