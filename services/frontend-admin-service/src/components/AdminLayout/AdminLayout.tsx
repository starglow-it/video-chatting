import React, {
	memo, PropsWithChildren 
} from 'react';
import {
	useStore 
} from 'effector-react';
import {useRouter} from "next/router";

// hooks
import {
	useBrowserDetect 
} from 'shared-frontend/hooks/useBrowserDetect';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import CustomGrid from 'shared-frontend/library/custom/CustomGrid/CustomGrid';
import ConditionalRender from 'shared-frontend/library/common/ConditionalRender/ConditionalRender';
import {
	AdminNavigation
} from '@components/AdminNavigation/AdminNavigation';
// types
import {
	AdminLayoutProps 
} from './AdminLayout.types';

// styles
import styles from './AdminLayout.module.scss';

import {
	$authStore 
} from '../../store';

const Component = ({
	children 
}: PropsWithChildren<AdminLayoutProps>) => {
	const router = useRouter();

	const {
		state: authState 
	} = useStore($authStore);
	const {
		isMobile 
	} = useBrowserDetect();

	const isNeedToRenderNavigation = !router.pathname.includes('rooms/create');

	return (
		<CustomBox className={styles.main}>
			<CustomGrid
				container
				direction="column"
				flex={1}
				flexWrap="nowrap"
				className={styles.contentWrapper}
			>
				<CustomGrid
					item
					container
					flex={1}
				>
					<CustomBox className={styles.bgImage} />
					<ConditionalRender condition={!isMobile}>
						<CustomBox className={styles.header}>
							<CustomGrid
								container
								justifyContent="space-between"
								alignItems="center"
							/>
						</CustomBox>
					</ConditionalRender>
					<ConditionalRender condition={authState?.isAuthenticated && isNeedToRenderNavigation}>
						<AdminNavigation />
					</ConditionalRender>
					{children}
				</CustomGrid>
			</CustomGrid>
		</CustomBox>
	);
};

export const AdminLayout = memo(Component);
