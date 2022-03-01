import {ICommonUserDTO} from "./common-user.interface";
import {ICommonTemplate} from "./common-template.interface";

export interface ICreateMeetingDTO {
    userId?: ICommonUserDTO["id"];
    serverIp?: string;
    templateId?: ICommonTemplate["id"];
}