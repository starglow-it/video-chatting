import {ICommonUserDTO} from "./common-user.interface";
import {ICommonTemplate} from "./common-template.interface";

export interface IGetMeetingTokenDTO {
  userId?: ICommonUserDTO["id"];
  templateId?: ICommonTemplate["id"];
}