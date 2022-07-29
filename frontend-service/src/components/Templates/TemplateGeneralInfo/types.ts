import { Profile, ProfileAvatarT, Template } from '../../../store/types';

export type TemplateGeneralInfoProps = {
    profileAvatar?: ProfileAvatarT['url'] | string;
    userName?: Profile['fullName'] | undefined;
    companyName?: Template['companyName'] | undefined;
    signBoard?: Profile['signBoard'];
};
