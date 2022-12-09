import React from 'react';
import {IBusinessCategory, ILanguage, ISocialLink, IUserTemplate} from 'shared-types';

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
    template: IUserTemplate;
    onTemplateUpdate: (updateData?: { templateId: IUserTemplate['id']; data: SettingsData }) => void;
}>;
