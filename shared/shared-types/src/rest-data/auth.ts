import { ICommonTemplate, ICommonUser } from '../api-interfaces';

export interface IUserCredentials {
  email?: ICommonUser['email'];
  userId?: ICommonUser['id'];
  password: ICommonUser['password'];
  templateId?: ICommonTemplate['id'];
  country?: ICommonUser['country'];
}
