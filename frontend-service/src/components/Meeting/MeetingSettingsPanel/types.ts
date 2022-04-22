import React from 'react';
import { UserTemplate } from '../../../store/types';

export type MeetingSettingsPanelProps = React.PropsWithChildren<{
    template: UserTemplate;
    onTemplateUpdate: (updateData?: any) => void;
}>;
