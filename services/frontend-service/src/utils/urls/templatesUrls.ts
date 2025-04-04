import { ICommonTemplate, IUserTemplate, QueryParams } from 'shared-types';
import {
    profileScope,
    serverUrl,
    templatesScope,
    usersScope,
} from './baseData';
import { HttpMethods } from '../../store/types';

import frontendConfig from '../../const/config';

export const templatesUrl = `${serverUrl}/${templatesScope}`;
export const userTemplatesUrl = `${serverUrl}/${usersScope}`;

export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/user-templates?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});

export const userTemplateUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
    url: `${userTemplatesUrl}/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const userTemplateByIdUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
    url: `${userTemplatesUrl}/templates/id/${templateId}`,
    method: HttpMethods.Get,
});

export const updateProfileTemplateUrl = ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}) => ({
    url: `${serverUrl}/${profileScope}/templates/${templateId}`,
    method: HttpMethods.Post,
});

export const getCommonTemplateUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Get,
});

export const getTemplatesUrl = (data: QueryParams) => {
    const urlHref = new URL(`${frontendConfig.frontendUrl}${templatesUrl}`);

    Object.entries(data).forEach(entry => {
        if (entry[1] !== undefined)
            urlHref.searchParams.append(entry[0], entry[1]);
    });

    return {
        url: urlHref.href,
        method: HttpMethods.Get,
    };
};

export const createTemplateUrl = {
    url: `${templatesUrl}`,
    method: HttpMethods.Post,
};

export const updateTemplateUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Put,
});

export const deleteTemplateUrl = ({
    templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
    url: `${templatesUrl}/${templateId}`,
    method: HttpMethods.Delete,
});

export const getUserTemplateUrl = ({ templateId }: { templateId: string }) => ({
    url: `${serverUrl}/user-templates/${templateId}`,
    method: HttpMethods.Get,
});

export const updateUserTemplateUrl = ({
    templateId,
}: {
    templateId: string;
}) => ({
    url: `${serverUrl}/user-templates/${templateId}`,
    method: HttpMethods.Put,
});

export const notifyToHostWhileWaitingRoomUrl = () => ({
    url: `${serverUrl}/user-templates/notify-to-host-while-waiting-room`,
    method: HttpMethods.Post,
});

export const removeWaitingUserFromUserTemplateUrl = () => ({
    url: `${serverUrl}/user-templates/remove-waiting-user-from-user-template`,
    method: HttpMethods.Post,
});
