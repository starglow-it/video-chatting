import { MeetingReactionKind } from "shared-types";

export type ReactMeetingChatRequestDto = {
    meetingChatId: string;
    kind: MeetingReactionKind
}