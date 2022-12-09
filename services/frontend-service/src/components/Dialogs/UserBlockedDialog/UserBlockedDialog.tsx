import {
	memo, useCallback 
} from 'react';
import {
	useStore 
} from 'effector-react';

import {
	useLocalization 
} from '@hooks/useTranslation';

import {
	Translation 
} from '@library/common/Translation/Translation';

import {
	$appDialogsStore, appDialogsApi 
} from '../../../store';

import styles from './UserBlockedDialog.module.scss';

import frontendConfig from '../../../const/config';

import {
	AppDialogsEnum 
} from '../../../store/types';
import {CustomDialog} from "shared-frontend/library/custom/CustomDialog";
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomImage} from "shared-frontend/library/custom/CustomImage";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";

const Component = () => {
	const {
		userBlockedDialog 
	} = useStore($appDialogsStore);

	const {
		translation 
	} = useLocalization('common');

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.userBlockedDialog,
		});
	}, []);

	return (
		<CustomDialog
			contentClassName={styles.dialog}
			open={userBlockedDialog}
		>
			<CustomGrid
				container
				justifyContent="center"
				alignItems="center"
				gap={1.5}
			>
				<CustomImage
					src="/images/robot.png"
					width="40px"
					height="40px"
				/>
				<CustomTypography
					className={styles.text}
					textAlign="center"
					dangerouslySetInnerHTML={{
						__html: translation('login.blocked.text', {
							supportEmail: frontendConfig.supportEmail,
						}),
					}}
				/>
				<CustomButton
					variant="custom-cancel"
					onClick={handleClose}
					label={
						<Translation
							nameSpace="common"
							translation="buttons.close"
						/>
					}
				/>
			</CustomGrid>
		</CustomDialog>
	);
};

export const UserBlockedDialog = memo(Component);
