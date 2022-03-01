import React, { memo } from 'react';

import { DashBoardNavigation } from '@components/DashBoardNavigation/DashBoardNavigation';

const DashboardLayout = memo(({ children }: React.PropsWithChildren<any>) => (
    <>
        <DashBoardNavigation />
        {children}
    </>
));

export { DashboardLayout };
