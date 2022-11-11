import React from 'react';
import { IBusinessCategory, ILanguage, ISocialLink } from 'shared-types';
import { UserTemplate } from '../../../store/types';

export type SettingsData = {
    companyName: string;
    contactEmail: string;
    description: string;
    fullName: string;
    position: string;
    signBoard: string;
    languages: ILanguage['key'][];
    businessCategories: IBusinessCategory['key'][];
    socials: ISocialLink[];
    customLink: string;
};

export type MeetingSettingsPanelProps = React.PropsWithChildren<{
    template: UserTemplate;
    onTemplateUpdate: (updateData?: { templateId: UserTemplate['id']; data: SettingsData }) => void;
}>;
