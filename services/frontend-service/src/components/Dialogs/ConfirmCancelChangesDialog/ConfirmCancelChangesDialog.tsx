import React, {
	memo, useCallback 
} from 'react';
import {
	useStore 
} from 'effector-react';

// custom
import {
	CustomDialog 
} from 'shared-frontend/library/custom/CustomDialog';
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomButton
} from 'shared-frontend/library/custom/CustomButton';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	Translation 
} from '@library/common/Translation/Translation';
// stores
import {
	$appDialogsStore, appDialogsApi 
} from '../../../store';

// types
import {
	ConfirmCancelChangesDialogProps 
} from './types';
import {
	AppDialogsEnum 
} from '../../../store/types';

// styles
import styles from './ConfirmCancelChangesDialog.module.scss';

const Component = ({
	onClose 
}: ConfirmCancelChangesDialogProps) => {
	const {
		editMeetingTemplateDialog 
	} = useStore($appDialogsStore);

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
		});
	}, []);

	const handleConfirmCancel = useCallback(() => {
		onClose?.();
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
		});
	}, []);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={editMeetingTemplateDialog}
			onBackdropClick={handleClose}
			onClose={handleClose}
		>
			<CustomGrid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<CustomTypography
					variant="h4bold"
					nameSpace="meeting"
					translation="templates.cancelChanges.title"
				/>
				<CustomTypography
					className={styles.text}
					nameSpace="meeting"
					translation="templates.cancelChanges.text"
				/>
				<CustomGrid
					container
					wrap="nowrap"
					gap={2}
				>
					<CustomButton
						variant="custom-cancel"
						label={
							<Translation
								nameSpace="meeting"
								translation="buttons.cancel"
							/>
						}
						onClick={handleConfirmCancel}
					/>
					<CustomButton
						label={
							<Translation
								nameSpace="meeting"
								translation="buttons.stay"
							/>
						}
						onClick={handleClose}
					/>
				</CustomGrid>
			</CustomGrid>
		</CustomDialog>
	);
};

export const ConfirmCancelChangesDialog = memo(Component);
