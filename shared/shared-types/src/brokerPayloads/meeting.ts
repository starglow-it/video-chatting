import {IMeetingInstance, ICommonTemplate, ICommonUser, IUserTemplate} from "../api-interfaces";

export type GetMediaServerTokenPayload = {
    templateId: string;
    userId: string;
};

export type CreateMeetingPayload = {
    templateId: ICommonTemplate["id"];
};

export type DeleteMeetingPayload = {
    templateId: ICommonTemplate["id"]
};

export type GetMeetingPayload = {
    meetingId: IMeetingInstance["id"];
};

export type UpdateMeetingInstancePayload = {
    instanceId: IMeetingInstance['instanceId'];
    data: Partial<IMeetingInstance>
}

export type GetMeetingInstancePayload = Partial<IMeetingInstance>;
export type DeleteMeetingInstancePayload = {
    id: IMeetingInstance["id"]
};
export type CreateMeetingInstancePayload = {
    instanceId: IMeetingInstance["instanceId"];
    serverStatus: IMeetingInstance["serverStatus"];
    snapshotId: IMeetingInstance["snapshotId"];
};
export type AssignMeetingInstancePayload = {
    templateId: IUserTemplate["id"];
    userId: ICommonUser["id"];
};