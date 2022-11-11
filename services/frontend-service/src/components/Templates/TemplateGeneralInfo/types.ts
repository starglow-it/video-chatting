import { ICommonTemplate, IProfileAvatar } from 'shared-types';
import { Profile } from '../../../store/types';

export type TemplateGeneralInfoProps = {
    profileAvatar?: IProfileAvatar['url'] | string;
    userName?: Profile['fullName'] | undefined;
    companyName?: ICommonTemplate['companyName'] | undefined;
    signBoard?: Profile['signBoard'];
};
