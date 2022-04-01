import React, { memo } from 'react';

import { DashBoardNavigation } from '@components/DashBoardNavigation/DashBoardNavigation';
import { ProfileNotifications } from '@components/Profile/ProfileNotifications/ProfileNotifications';

const DashboardLayout = memo(({ children }: React.PropsWithChildren<any>) => (
    <>
        <DashBoardNavigation />
        <ProfileNotifications />
        {children}
    </>
));

export { DashboardLayout };
