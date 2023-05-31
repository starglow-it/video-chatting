import React, { memo } from 'react';
import { DashBoardNavigation } from '@components/DashBoardNavigation/DashBoardNavigation';
import { DowngradedSubscriptionDialog } from '@components/Dialogs/DowngradedSubscriptionDialg/DowngradedSubscriptionDialg';

const Component = memo(({ children }: React.PropsWithChildren) => (
    <>
        <DashBoardNavigation />
        {children}
        <DowngradedSubscriptionDialog />
    </>
));

export const DashboardLayout = memo(Component);
