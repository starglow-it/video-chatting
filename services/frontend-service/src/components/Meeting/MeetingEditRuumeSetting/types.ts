import React from 'react';
import {
    IBusinessCategory,
    ILanguage,
    ISocialLink,
    IUserTemplate,
} from 'shared-types';

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
    onTemplateUpdate: (updateData?: {
        templateId: IUserTemplate['id'];
        data: SettingsData;
    }) => void;
}>;

import { StripeCurrency } from 'shared-const';

export type FormDataPayment = {
    enabledMeeting: boolean;
    enabledPaywall: boolean;
    templatePrice: number;
    paywallPrice: number;
    templateCurrency: StripeCurrency;
    paywallCurrency: StripeCurrency;
};

export type ChargeButtonProps = {
    children?: any;
    tooltipButton: string | JSX.Element;
    onClose?(): void;
    onToggle?: (isToggle: boolean) => void;
    transformOriginVertical?: number;
};

export enum TabsValues {
    Participants = 1,
    Audience = 2,
}

