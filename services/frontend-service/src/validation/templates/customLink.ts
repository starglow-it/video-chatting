import * as yup from 'yup';

export const customTemplateLinkSchema = () =>
    yup
        .string()
        .max(60, 'meeting.settings.customLink.maxLength')
        .matches(/^[A-Za-z0-9]*$/gim, 'meeting.settings.customLink.characters');
