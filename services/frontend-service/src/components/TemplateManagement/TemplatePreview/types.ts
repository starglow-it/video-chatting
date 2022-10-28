import React from 'react';

export type TemplatePreviewProps = {
    onPreviousStep: () => void;
    onSubmit: () => void;
    controlPanelRef?: React.RefObject<HTMLDivElement | null>;
    templateId?: string;
};
