import { ICommonTemplate, ICommonUser } from '../api-interfaces';

export enum RegisterType {
  EndCall = 'end-call',
  Default = 'default',
}

export interface IUserCredentials {
  email?: ICommonUser['email'];
  userId?: ICommonUser['id'];
  password: ICommonUser['password'];
  country?: ICommonUser['country'];
  state?: ICommonUser['state'];
  registerType?: RegisterType;
  loginType?: ICommonUser['loginType'];
  teamMembers?: ICommonUser['teamMembers'];
  teamOrganization?: ICommonUser['teamOrganization'];
  subscriptionPlanKey?: ICommonUser['subscriptionPlanKey'];
  hostId?: string;
}
