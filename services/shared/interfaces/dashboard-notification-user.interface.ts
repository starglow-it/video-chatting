import {ICommonUserDTO} from "./common-user.interface";

export interface IDashboardNotificationUser {
    fullName: ICommonUserDTO["fullName"]
    profileAvatar: ICommonUserDTO["profileAvatar"]
}