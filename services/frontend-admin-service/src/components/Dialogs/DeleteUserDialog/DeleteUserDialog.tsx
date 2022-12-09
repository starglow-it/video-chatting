import {
	memo, useCallback 
} from 'react';
import {
	useStore, useStoreMap 
} from 'effector-react';

// shared
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomButton 
} from 'shared-frontend/library/custom/CustomButton';
import {
	CustomDialog 
} from 'shared-frontend/library/custom/CustomDialog';
import {
	CustomTypography 
} from 'shared-frontend/library/custom/CustomTypography';

// components
import {
	Translation 
} from '@components/Translation/Translation';

import {
	$deleteUserDialogStore,
	$deleteUserIdStore,
	$usersStore,
	addNotificationEvent,
	closeAdminDialogEvent,
	deleteUserFx,
	setDeleteUserId,
} from '../../../store';

import {
	AdminDialogsEnum, NotificationType 
} from '../../../store/types';

import styles from './DeleteUserDialog.module.scss';

const Component = () => {
	const deleteUserDialog = useStore($deleteUserDialogStore);
	const {
		state: deleteUserId 
	} = useStore($deleteUserIdStore);

	const userData = useStoreMap({
		store: $usersStore,
		keys: [deleteUserId],
		fn: (state, [userId]) =>
			state?.state?.list?.find(user => user.id === userId) || null,
	});

	const handleClose = useCallback(() => {
		closeAdminDialogEvent(AdminDialogsEnum.deleteUserDialog);
		setDeleteUserId(null);
	}, []);

	const handleDeleteUser = useCallback(async () => {
		closeAdminDialogEvent(AdminDialogsEnum.deleteUserDialog);
		setDeleteUserId(null);
		await deleteUserFx({
			userId: deleteUserId,
		});
		addNotificationEvent({
			type: NotificationType.userDeleted,
			message: 'users.userDeleted',
			messageOptions: {
				username: userData?.fullName || userData?.email,
			},
			iconType: 'DeleteIcon',
		});
	}, [deleteUserId, userData?.fullName]);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={deleteUserDialog}
		>
			<CustomGrid
				container
				alignItems="center"
				justifyContent="center"
			>
				<CustomTypography variant="h4">
					<Translation
						nameSpace="users"
						translation="dialogs.deleteUser.title"
					/>
				</CustomTypography>
                &nbsp;
				<CustomTypography variant="h4bold">
					{userData?.fullName || userData?.email}
				</CustomTypography>
			</CustomGrid>
			<CustomGrid
				className={styles.buttons}
				container
				alignItems="center"
				wrap="nowrap"
				gap={2}
			>
				<CustomButton
					variant="custom-danger"
					onClick={handleDeleteUser}
					label={
						<Translation
							nameSpace="common"
							translation="buttons.delete"
						/>
					}
				/>
				<CustomButton
					variant="custom-cancel"
					onClick={handleClose}
					label={
						<Translation
							nameSpace="common"
							translation="buttons.cancel"
						/>
					}
				/>
			</CustomGrid>
		</CustomDialog>
	);
};

export const DeleteUserDialog = memo(Component);
