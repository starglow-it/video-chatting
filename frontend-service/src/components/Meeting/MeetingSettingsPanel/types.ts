import React from 'react';
import { Template } from '../../../store/types';

export type MeetingSettingsPanelProps = React.PropsWithChildren<{
    template: Template;
    onTemplateUpdate: (updateData?: any) => void;
}>;
