import React, {
	memo, useCallback 
} from 'react';
import {
	useRouter 
} from 'next/router';
import {
	useStore 
} from 'effector-react';

// components
import {CustomDialog} from "shared-frontend/library/custom/CustomDialog";
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import { WarningIcon } from 'shared-frontend/icons/OtherIcons/WarningIcon';
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import {
	Translation 
} from '@library/common/Translation/Translation';

// stores
import {
	$appDialogsStore, appDialogsApi 
} from '../../../store';

// types
import {
	AppDialogsEnum 
} from '../../../store/types';

// routes
import {
	dashboardRoute 
} from '../../../const/client-routes';

import styles from './HostUserDeletedDialog.module.scss';

const Component = () => {
	const router = useRouter();

	const {
		hostUserDeletedDialog 
	} = useStore($appDialogsStore);

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.hostUserDeletedDialog,
		});
		router.push(dashboardRoute);
	}, []);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={hostUserDeletedDialog}
			onClose={handleClose}
		>
			<CustomGrid
				container
				alignItems="center"
				direction="column"
			>
				<CustomGrid
					container
					alignItems="center"
					justifyContent="center"
				>
					<WarningIcon
						className={styles.icon}
						width="36px"
						height="36px"
					/>
					<CustomTypography
						variant="h3bold"
						nameSpace="meeting"
						translation="hostDeleted.title"
					/>
				</CustomGrid>

				<CustomTypography
					textAlign="center"
					label={
						<Translation
							nameSpace="meeting"
							translation="hostDeleted.text"
						/>
					}
				/>

				<CustomButton
					onClick={handleClose}
					label={
						<Translation
							nameSpace="meeting"
							translation="expired.button"
						/>
					}
					className={styles.button}
					variant="custom-cancel"
				/>
			</CustomGrid>
		</CustomDialog>
	);
};

export const HostUserDeletedDialog = memo(Component);
