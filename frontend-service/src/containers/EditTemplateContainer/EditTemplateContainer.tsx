import React, { memo } from 'react';

// components
import { EditMeetingTemplateView } from '@components/Meeting/EditMeetingTemplateView/EditMeetingTemplateView';

const EditTemplateContainer = memo(() => {
    return <EditMeetingTemplateView />;
});

export { EditTemplateContainer };
