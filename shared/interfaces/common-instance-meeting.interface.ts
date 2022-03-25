import { ICommonUserDTO } from "./common-user.interface";

export interface ICommonMeetingInstanceDTO {
    id: string;
    serverIp: string;
    owner: ICommonUserDTO["id"];
    serverStatus: string;
}