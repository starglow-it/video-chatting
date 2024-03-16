import { sendJoinWaitingRoomSocketEvent } from '../../sockets/init';
import { emitEnterMeetingEvent } from '../../sockets/model';

export const handleJoinMetingInWaitingRoom = async () => {
    await sendJoinWaitingRoomSocketEvent({ userIds: [], isScheduled: false });

    emitEnterMeetingEvent();
};
