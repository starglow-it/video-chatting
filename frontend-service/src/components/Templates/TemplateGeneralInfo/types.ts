import { Profile, ProfileAvatar, Template } from '../../../store/types';

export type TemplateGeneralInfoProps = {
    profileAvatar: ProfileAvatar['url'] | string;
    userName: Profile['fullName'];
    companyName: Template['companyName'];
    signBoard: Profile['signBoard'];
};
