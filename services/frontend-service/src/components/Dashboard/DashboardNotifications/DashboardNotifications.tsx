import React, {
	forwardRef, memo, useCallback, useMemo 
} from 'react';
import {
	useStore 
} from 'effector-react';

import {
	ClickAwayListener 
} from '@mui/material';

// custom
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomPaper 
} from '@library/custom/CustomPaper/CustomPaper';
import {
	CustomScroll 
} from '@library/custom/CustomScroll/CustomScroll';

// components
import {
	BellIcon 
} from 'shared-frontend/icons/OtherIcons/BellIcon';
import {
	DashboardNotificationItem 
} from '@components/Dashboard/DashboardNotificationItem/DashboardNotificationItem';

// types
import {
	CustomImage 
} from 'shared-frontend/library/custom/CustomImage';

import {
	DashboardNotificationsProps 
} from './types';

// shared

// stores
import {
	$dashboardNotificationsStore,
	sendReadDashboardNotificationsSocketEvent,
} from '../../../store';

// styles
import styles from './DashboardNotifications.module.scss';

type ComponentPropsType = DashboardNotificationsProps;

const Component: React.FunctionComponent<ComponentPropsType> = (
	{
		onClickAway 
	},
	ref,
) => {
	const dashboardNotifications = useStore($dashboardNotificationsStore);

	const handleMarkAllNotificationAsRead = useCallback(() => {
		sendReadDashboardNotificationsSocketEvent();
	}, []);

	const renderDashboardNotifications = useMemo(
		() =>
			dashboardNotifications.map(dashboardNotification => (
				<DashboardNotificationItem
					key={dashboardNotification.id}
					notification={dashboardNotification}
				/>
			)),
		[dashboardNotifications],
	);

	return (
		<CustomPaper
			ref={ref}
			className={styles.paper}
		>
			<ClickAwayListener onClickAway={onClickAway}>
				{!dashboardNotifications?.length ? (
					<CustomGrid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						className={styles.noNotificationsWrapper}
					>
						<CustomImage
							src="/images/eyes.webp"
							width={40}
							height={40}
						/>
						<CustomTypography
							nameSpace="dashboard"
							translation="notifications.noNotifications"
						/>
					</CustomGrid>
				) : (
					<CustomGrid
						container
						direction="column"
						className={styles.notificationsWrapper}
					>
						<CustomGrid
							container
							justifyContent="center"
							className={styles.header}
						>
							<BellIcon
								width="24px"
								height="24px"
								className={styles.bellIcon}
							/>
							<CustomTypography
								variant="body1bold"
								nameSpace="dashboard"
								translation="notifications.title"
							/>
							<CustomTypography
								onClick={handleMarkAllNotificationAsRead}
								color="colors.blue.primary"
								className={styles.markAllAsRead}
								nameSpace="dashboard"
								translation="notifications.readAll"
							/>
						</CustomGrid>
						<CustomScroll className={styles.notificationsScroll}>
							<CustomGrid
								container
								direction="column"
							>
								{renderDashboardNotifications}
							</CustomGrid>
						</CustomScroll>
					</CustomGrid>
				)}
			</ClickAwayListener>
		</CustomPaper>
	);
};

export const DashboardNotifications = memo<ComponentPropsType>(
	forwardRef<HTMLDivElement, ComponentPropsType>(Component),
);
