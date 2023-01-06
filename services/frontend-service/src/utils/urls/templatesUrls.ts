import { ICommonTemplate } from 'shared-types';
import { serverUrl, usersScope} from './baseData';
import { HttpMethods } from '../../store/types';

export const userTemplatesUrl = `${serverUrl}/${usersScope}`;

export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/user-templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const userTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Get,
});
