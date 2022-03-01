import { ICommonUserDTO } from "./common-user.interface";
import { ICommonTemplate } from "./common-template.interface";

export interface ICommonMeetingInstanceDTO {
    id: string;
    serverIp: string;
    meetingToken: string;
    template: ICommonTemplate["id"];
    owner: ICommonUserDTO["id"];
    serverStatus: string;
}