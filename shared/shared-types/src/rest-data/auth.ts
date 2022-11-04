import {ICommonUser} from "../api-interfaces";

export interface IUserCredentials {
    email?: ICommonUser["email"];
    userId?: ICommonUser["id"];
    password: ICommonUser["password"];
    country?: ICommonUser["country"];
}