import { setMeetingReactionsEvent } from '../../meetingReactions/model';
import { MeetingReaction } from '../../../../types';

export const handleSendMeetingReaction = ({
    meetingReactions,
}: {
    meetingReactions: MeetingReaction[];
}) => {
    setMeetingReactionsEvent(meetingReactions);
};
