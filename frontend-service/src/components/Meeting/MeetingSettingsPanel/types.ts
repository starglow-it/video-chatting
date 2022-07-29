import React from 'react';
import { BusinessCategory, Language, SocialLink, UserTemplate } from '../../../store/types';

export type SettingsData = {
    companyName: string;
    contactEmail: string;
    description: boolean;
    fullName: string;
    position: string;
    signBoard: string;
    languages: Language['key'][];
    businessCategories: BusinessCategory['key'][];
    socials: SocialLink[];
    customLink: string;
};

export type MeetingSettingsPanelProps = React.PropsWithChildren<{
    template: UserTemplate;
    onTemplateUpdate: (updateData?: { templateId: UserTemplate['id']; data: SettingsData }) => void;
}>;
