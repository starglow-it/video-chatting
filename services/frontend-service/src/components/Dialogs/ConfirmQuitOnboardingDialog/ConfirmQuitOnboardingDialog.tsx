import React, {
	memo, useCallback 
} from 'react';
import {
	useStore 
} from 'effector-react';

// custom
import {
	CustomDialog 
} from 'shared-frontend/library';
import {
	CustomGrid 
} from 'shared-frontend/library';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomButton 
} from 'shared-frontend/library';

// store
import {
	Translation 
} from '@library/common/Translation/Translation';
import {
	$appDialogsStore, appDialogsApi 
} from '../../../store';

// styles
import styles from './ConfirmQuitOnboardingDialog.module.scss';

// types
import {
	ConfirmQuitOnboardingDialogProps 
} from './types';
import {
	AppDialogsEnum 
} from '../../../store/types';

const Component = ({
	onConfirm,
	onCancel,
}: ConfirmQuitOnboardingDialogProps) => {
	const {
		confirmQuitOnboardingDialog 
	} = useStore($appDialogsStore);

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.confirmQuitOnboardingDialog,
		});
	}, []);

	const handleCancel = useCallback(() => {
		onCancel?.();
	}, [onCancel]);

	const handleConfirm = useCallback(() => {
		onConfirm?.();
	}, [onConfirm]);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={confirmQuitOnboardingDialog}
			onBackdropClick={handleClose}
			onClose={handleClose}
		>
			<CustomGrid
				container
				direction="column"
				alignItems="center"
				gap={3}
			>
				<CustomTypography
					variant="h4bold"
					nameSpace="templates"
					translation="onboarding.quit"
				/>
				<CustomTypography
					nameSpace="templates"
					translation="onboarding.explanation"
					align="center"
					className={styles.text}
				/>
				<CustomGrid
					container
					gap={1.5}
					className={styles.buttons}
					wrap="nowrap"
				>
					<CustomButton
						onClick={handleConfirm}
						variant="custom-cancel"
						label={
							<Translation
								nameSpace="common"
								translation="buttons.quit"
							/>
						}
					/>
					<CustomButton
						onClick={handleCancel}
						label={
							<Translation
								nameSpace="common"
								translation="buttons.stay"
							/>
						}
					/>
				</CustomGrid>
			</CustomGrid>
		</CustomDialog>
	);
};

export const ConfirmQuitOnboardingDialog = memo(Component);
