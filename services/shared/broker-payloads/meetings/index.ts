import { ICommonUserDTO } from "../../interfaces/common-user.interface";
import { ICommonTemplate } from "../../interfaces/common-template.interface";
import { ICommonMeetingInstance } from "../../interfaces/common-instance-meeting.interface";
import { IUserTemplate } from "../../interfaces/user-template.interface";

export type GetMediaServerTokenPayload = {
  templateId: string;
  userId: string;
};

export type CreateMeetingPayload = {
  userId: ICommonUserDTO["id"];
  templateId: ICommonTemplate["id"];
};

export type CreateServerPayload = { templateId: IUserTemplate["id"]; userId: ICommonUserDTO["id"] };
export type WaitForAvailableServerPayload = { templateId: IUserTemplate["id"]; userId: ICommonUserDTO["id"]; instanceId: ICommonMeetingInstance["instanceId"] };

export type DeleteMeetingPayload = { templateId: string };

export type GetMeetingPayload = {
  meetingId: ICommonMeetingInstance["id"];
};

export type UpdateMeetingInstancePayload = {
  instanceId: ICommonMeetingInstance['instanceId'];
  data: Partial<ICommonMeetingInstance>
}

export type GetMeetingInstancePayload = Partial<ICommonMeetingInstance>;
export type DeleteMeetingInstancePayload = { id: ICommonMeetingInstance["id"] };
export type CreateMeetingInstancePayload = {
  instanceId: ICommonMeetingInstance["instanceId"];
  serverStatus: ICommonMeetingInstance["serverStatus"];
  snapshotId: ICommonMeetingInstance["snapshotId"];
};

export type AssignMeetingInstancePayload = {
  templateId: IUserTemplate["id"];
  userId: ICommonUserDTO["id"];
};

