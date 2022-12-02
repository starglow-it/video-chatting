import React, {
	memo, useCallback 
} from 'react';
import {
	useStoreMap 
} from 'effector-react';
import clsx from 'clsx';

// shared
import {
	ActionButton,
	CustomGrid,
	CustomTooltip,
	LockIcon,
	TrashIcon,
} from 'shared-frontend';
import {
	Translation 
} from '@components/Translation/Translation';

// stores
import {
	$usersStore,
	setBlockUserId,
	setDeleteUserId,
	openAdminDialogEvent,
} from '../../../store';

// styles
import styles from './UserTableActions.module.scss';

// types
import {
	AdminDialogsEnum 
} from '../../../store/types';

const Component = ({
	actionId 
}: { actionId: string }) => {
	const userData = useStoreMap({
		store: $usersStore,
		keys: [actionId],
		fn: (state, [userId]) =>
			state?.state?.list?.find(user => user.id === userId) || null,
	});

	const handleBlockUser = useCallback(() => {
		setBlockUserId(actionId);
		openAdminDialogEvent(AdminDialogsEnum.blockUserDialog);
	}, [actionId]);

	const handleDeleteUser = useCallback(() => {
		setDeleteUserId(actionId);
		openAdminDialogEvent(AdminDialogsEnum.deleteUserDialog);
	}, [actionId]);

	return (
		<CustomGrid
			container
			alignItems="center"
			justifyContent="center"
			gap={1}
		>
			<CustomTooltip
				title={
					<Translation
						nameSpace="common"
						translation={`tooltips.users.${
							userData?.isBlocked ? 'unblock' : 'block'
						}`}
					/>
				}
				placement="bottom"
			>
				<ActionButton
					className={clsx(styles.actionButton, {
						[styles.blocked]: userData?.isBlocked,
					})}
					onAction={handleBlockUser}
					variant="decline"
					Icon={<LockIcon
						width="18px"
						height="18px"
					      />}
				/>
			</CustomTooltip>
			<CustomTooltip
				title={
					<Translation
						nameSpace="common"
						translation="tooltips.users.delete"
					/>
				}
				placement="bottom"
			>
				<ActionButton
					className={styles.actionButton}
					onAction={handleDeleteUser}
					variant="decline"
					Icon={<TrashIcon
						width="18px"
						height="18px"
					      />}
				/>
			</CustomTooltip>
		</CustomGrid>
	);
};

export const UserTableActions = memo(Component);
