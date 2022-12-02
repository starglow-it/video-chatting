import React, {
	memo 
} from 'react';

import {
	DashBoardNavigation 
} from '@components/DashBoardNavigation/DashBoardNavigation';
import {
	ProfileNotifications 
} from '@components/Profile/ProfileNotifications/ProfileNotifications';
import {
	DowngradedSubscriptionDialog 
} from '@components/Dialogs/DowngradedSubscriptionDialg/DowngradedSubscriptionDialg';

const Component = memo(({
	children 
}: React.PropsWithChildren) => (
	<>
		<DashBoardNavigation />
		<ProfileNotifications />
		{children}
		<DowngradedSubscriptionDialog />
	</>
));

export const DashboardLayout = memo(Component);
