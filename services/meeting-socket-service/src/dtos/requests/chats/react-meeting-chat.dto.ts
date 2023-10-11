import { IsNotEmpty, IsString } from "class-validator";
import { MeetingReactionKind } from "shared-types";

export class ReactMeetingChatRequestDto {
    @IsNotEmpty()
    @IsString({
        message: 'meetingChatId invalid'
    })
    meetingChatId: string;

    @IsNotEmpty()
    @IsString({
        message: 'Kind invalid'
    })
    kind: MeetingReactionKind;
}