import React, {
	memo, useCallback, useEffect, useMemo, useState 
} from 'react';
import SnackbarContent from '@mui/material/SnackbarContent/SnackbarContent';
import Snackbar from '@mui/material/Snackbar/Snackbar';

import {
	useStore
} from 'effector-react';

// hooks
import {
	useLocalization
} from '@hooks/useTranslation';
import {
	useBrowserDetect
} from 'shared-frontend/hooks/useBrowserDetect';

// custom
import CustomGrid from 'shared-frontend/library/custom/CustomGrid/CustomGrid';
import CustomTypography from 'shared-frontend/library/custom/CustomTypography/CustomTypography';
import ConditionalRender from 'shared-frontend/library/common/ConditionalRender/ConditionalRender';

// icons
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';
import {
	RoundErrorIcon
} from 'shared-frontend/icons/RoundIcons/RoundErrorIcon';
import {
	RoundSuccessIcon
} from 'shared-frontend/icons/RoundIcons/RoundSuccessIcon';

// const
import {
	ONE_SECOND
} from 'shared-const';

// store
import {
	$notificationsStore, removeNotification
} from '../../store';

// types
import {
	Notification
} from '../../store/types';

// styles
import styles from './ToastsNotifications.module.scss';

const AUTO_HIDE_DURATION = 7 * ONE_SECOND;

const icons = {
	LockIcon,
	DeleteIcon: TrashIcon,
};

const Component = () => {
	const notifications = useStore($notificationsStore);

	const {
		translation
	} = useLocalization('notifications');

	const [open, setOpen] = useState(false);
	const [messageInfo, setMessageInfo] = useState<Notification>();

	const {
		isMobile
	} = useBrowserDetect();

	useEffect(() => {
		if (notifications.length && !messageInfo) {
			setMessageInfo({
				...notifications[0],
			});
			removeNotification();
			setOpen(true);
		} else if (notifications.length && messageInfo && open) {
			setOpen(false);
		}
	}, [notifications, messageInfo, open]);

	const handleExited = useCallback(() => {
		setMessageInfo(undefined);
	}, []);

	const handleClose = useCallback(() => {
		setMessageInfo(undefined);
		setOpen(false);
	}, []);

	const Icon = useMemo(
		() => icons[messageInfo?.iconType],
		[messageInfo?.iconType],
	);

	return (
		<Snackbar
			onClose={handleClose}
			key={messageInfo ? messageInfo.type : undefined}
			TransitionProps={{
				onExited: handleExited,
			}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: isMobile ? 'left' : 'center',
			}}
			open={open}
			{...(messageInfo?.withManualClose
				? {
				}
				: {
					autoHideDuration: AUTO_HIDE_DURATION,
				})}
		>
			<SnackbarContent
				className={styles.content}
				message={
					<CustomGrid
						container
						alignItems="center"
						gap={1}
					>
						<ConditionalRender
							condition={Boolean(messageInfo?.withSuccessIcon)}
						>
							<RoundSuccessIcon
								width="16px"
								height="16px"
							/>
						</ConditionalRender>
						<ConditionalRender
							condition={Boolean(messageInfo?.withErrorIcon)}
						>
							<RoundErrorIcon
								width="16px"
								height="16px"
							/>
						</ConditionalRender>
						{Boolean(Icon)
							? (
								<Icon
									width="16px"
									height="16px"
								/>
							)
							: null
						}
						<CustomTypography
							dangerouslySetInnerHTML={{
								__html: translation(
									messageInfo?.message || '',
									messageInfo?.messageOptions ?? {
									},
								),
							}}
						/>
					</CustomGrid>
				}
			/>
		</Snackbar>
	);
};

export const ToastsNotifications = memo(Component);
