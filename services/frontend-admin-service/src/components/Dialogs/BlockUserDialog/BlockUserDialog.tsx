import {
	memo, useCallback 
} from 'react';
import {
	useStore, useStoreMap 
} from 'effector-react';

// shared
import {
	CustomButton,
	CustomDialog,
	CustomGrid,
	CustomTypography,
} from 'shared-frontend';

// components
import {
	Translation 
} from '@components/Translation/Translation';

// stores
import {
	$blockUserDialogStore,
	$blockUserIdStore,
	$usersStore,
	blockUserFx,
	closeAdminDialogEvent,
	setBlockUserId,
} from '../../../store';

// types
import {
	AdminDialogsEnum 
} from '../../../store/types';

// styles
import styles from './BlockUserDialog.module.scss';

const Component = () => {
	const blockUserDialog = useStore($blockUserDialogStore);
	const {
		state: blockUserId 
	} = useStore($blockUserIdStore);

	const userData = useStoreMap({
		store: $usersStore,
		keys: [blockUserId],
		fn: (state, [userId]) =>
			state?.state?.list?.find(user => user.id === userId) || null,
	});

	const handleClose = useCallback(() => {
		closeAdminDialogEvent(AdminDialogsEnum.blockUserDialog);
		setBlockUserId(null);
	}, []);

	const handleBlockUser = useCallback(() => {
		closeAdminDialogEvent(AdminDialogsEnum.blockUserDialog);
		blockUserFx({
			userId: blockUserId,
			isBlocked: !userData?.isBlocked,
		});
		setBlockUserId(null);
	}, [blockUserId, userData?.isBlocked]);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={blockUserDialog}
		>
			<CustomGrid
				container
				alignItems="center"
				justifyContent="center"
			>
				<CustomTypography variant="h4">
					<Translation
						nameSpace="users"
						translation={`dialogs.${
							userData?.isBlocked ? 'unblockUser' : 'blockUser'
						}.title`}
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
					variant={
						userData?.isBlocked ? 'custom-black' : 'custom-danger'
					}
					onClick={handleBlockUser}
					label={
						<Translation
							nameSpace="common"
							translation={
								userData?.isBlocked
									? 'buttons.unblock'
									: 'buttons.block'
							}
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

export const BlockUserDialog = memo(Component);
