import React from 'react';

import { ParticipantPosition } from 'shared-frontend/types';
import { ITemplateLink } from 'shared-types';

export type TemplatePreviewProps = {
    onPreviousStep: () => void;
    participantsPositions: ParticipantPosition[];
    templateTags: { id: string; label: string; color: string }[];
    description: string;
    templateLinks: ITemplateLink[];
    submitButtons: React.ReactNode;
};
