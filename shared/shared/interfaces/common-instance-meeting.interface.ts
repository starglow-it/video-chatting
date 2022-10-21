import { ICommonUserDTO } from "./common-user.interface";

export interface ICommonMeetingInstance {
    id: string;
    serverIp: string;
    owner: ICommonUserDTO["id"];
    serverStatus: 'active' | 'inactive' | 'stopped' | 'pending';
    instanceId: string;
    snapshotId: string;
}