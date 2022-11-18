import { ICommonTemplate } from 'shared-types';

export type TemplateInfoProps = {
    name: ICommonTemplate['name'];
    description: ICommonTemplate['description'];
    isPublic?: ICommonTemplate['isPublic'];
    isCommonTemplate?: boolean;
};
