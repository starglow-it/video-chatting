import { IProfileAvatar } from "./profile-avatar.interface";
import { ICommonUserDTO } from "./common-user.interface";

export interface ITemplateUser {
  id: string;
  profileAvatar: IProfileAvatar;
  maxMeetingTime: ICommonUserDTO["maxMeetingTime"];
}
