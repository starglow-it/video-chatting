import { IsNotEmpty, IsString } from "class-validator";
import { MeetingReactionKind } from "shared-types";

export class ReactMeetingChatRequestDto {
    @IsNotEmpty()
    @IsString()
    meetingChatId: string;

    @IsNotEmpty()
    @IsString()
    kind: MeetingReactionKind;
}