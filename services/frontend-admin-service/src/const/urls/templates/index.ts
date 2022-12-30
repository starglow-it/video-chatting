import {
	DeleteCommonTemplateSoundPayload,
	HttpMethods, ICommonTemplate, QueryParams
} from 'shared-types';
import { templatesScope } from 'shared-const';
import frontendConfig from '../../config';
import { serverUrl } from '../common';

export const templatesUrl = `${serverUrl}/${templatesScope}`;

export const getTemplatesUrl = (data: QueryParams) => {
	const urlHref = new URL(`${frontendConfig.frontendUrl}${templatesUrl}`);

	Object.entries(data).forEach(entry => {
		urlHref.searchParams.append(entry[0], entry[1]);
	});

	return {
		url: urlHref.href,
		method: HttpMethods.Get,
	};
};

export const createCommonTemplateUrl = {
	url: `${templatesUrl}`,
	method: HttpMethods.Post,
};

export const updateCommonTemplateUrl = ({
	templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
	url: `${templatesUrl}/${templateId}`,
	method: HttpMethods.Put,
});

export const getCommonTemplateUrl = ({
	templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
	url: `${templatesUrl}/${templateId}`,
	method: HttpMethods.Get,
});

export const deleteCommonTemplateUrl = ({
	templateId,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
	url: `${templatesUrl}/${templateId}`,
	method: HttpMethods.Delete,
});

export const deleteCommonTemplateSoundUrl = ({
	templateId,
 	updateKey,
}: DeleteCommonTemplateSoundPayload) => ({
	url: `${templatesUrl}/${templateId}/sound?updateKey=${updateKey}`,
	method: HttpMethods.Delete,
});

export const uploadCommonTemplateSoundUrl = ({
	templateId,
 	updateKey,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
	url: `${templatesUrl}/${templateId}/sound?updateKey=${updateKey}`,
	method: HttpMethods.Post,
});

export const uploadCommonTemplateBackgroundUrl = ({
	templateId,
 	updateKey,
}: {
    templateId: ICommonTemplate['id'];
}) => ({
	url: `${templatesUrl}/${templateId}/background?updateKey=${updateKey}`,
	method: HttpMethods.Post,
});
