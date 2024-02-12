import { setMeetingReactionsEvent } from '../../meetingReactions/model';
import { MeetingReaction } from '../../../../types';

export const handleGetMeetingReactions = ({
    meetingReactions,
}: {
    meetingReactions: MeetingReaction[];
}) => {
    setMeetingReactionsEvent(meetingReactions);
};
