import {Profile, ProfileAvatarT, Template} from '../../../store/types';

export type TemplateGeneralInfoProps = {
    profileAvatar: ProfileAvatarT['url'] | string;
    userName: Profile['fullName'];
    companyName: Template['companyName'];
    signBoard: Profile['signBoard'];
};
