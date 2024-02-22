import { removeMeetingReactionEvent } from '../../meetingReactions/model';
import { MeetingReaction } from '../../../../types';

export const handleRemoveMeetingReaction = ({
    meetingReactionId,
}: {
    meetingReactionId: MeetingReaction['id'];
}) => {
    removeMeetingReactionEvent(meetingReactionId);
};
