import {memo} from "react";
import {useStore} from "effector-react";

import {MeetingBackgroundVideo} from "@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo";
import {MeetingBackgroundModel} from "@components/Meeting/MeetingBackgroundModel/MeetingBackgroundModel";

import {$meetingStore, $meetingTemplateStore} from "../../../store";

const Component = ({ isNeedToRenderModel, children }) => {
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);

    const isScreenSharing = Boolean(meeting.sharingUserId);

    if (isNeedToRenderModel) {
        return (
            <MeetingBackgroundModel>
                {children}
            </MeetingBackgroundModel>
        );
    }

    return (
        <MeetingBackgroundVideo isScreenSharing={isScreenSharing} src={meetingTemplate.url}>
            {children}
        </MeetingBackgroundVideo>
    )
}

export const MeetingBackgroundComponent = memo(Component);