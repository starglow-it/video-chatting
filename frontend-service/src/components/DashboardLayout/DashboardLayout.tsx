import React, { memo } from 'react';

import { DashBoardNavigation } from '@components/DashBoardNavigation/DashBoardNavigation';
import { ProfileNotifications } from '@components/Profile/ProfileNotifications/ProfileNotifications';

const Component = memo(({ children }: React.PropsWithChildren) => (
    <>
        <DashBoardNavigation />
        <ProfileNotifications />
        {children}
    </>
));

export const DashboardLayout = memo(Component);
