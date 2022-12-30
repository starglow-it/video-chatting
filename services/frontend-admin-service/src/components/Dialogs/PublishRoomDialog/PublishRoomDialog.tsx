import {
	memo, useCallback 
} from 'react';
import {
	useStore, useStoreMap 
} from 'effector-react';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

// components
import { Translation } from '@components/Translation/Translation';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';

import {
	$activeTemplateIdStore,
	$commonTemplates,
	$publishRoomDialogStore,
	addNotificationEvent,
	closeAdminDialogEvent,
	setActiveTemplateIdEvent,
	updateCommonTemplateFx,
} from '../../../store';

import {
	AdminDialogsEnum, NotificationType 
} from '../../../store/types';

import styles from './PublishRoomDialog.module.scss';

const Component = () => {
	const activeTemplateId = useStore($activeTemplateIdStore);
	const publishRoomDialog = useStore($publishRoomDialogStore);

	const templateData = useStoreMap({
		store: $commonTemplates,
		keys: [activeTemplateId],
		fn: (state, [templateId]) =>
			state.state.list.find(template => template.id === templateId),
	});

	const handleClose = useCallback(() => {
		closeAdminDialogEvent(AdminDialogsEnum.publishRoomDialog);
		setActiveTemplateIdEvent(null);
	}, []);

	const handlePublishRoom = useCallback(async () => {
		closeAdminDialogEvent(AdminDialogsEnum.publishRoomDialog);
		setActiveTemplateIdEvent(null);

		if (templateData?.id) {
			await updateCommonTemplateFx({
				templateId: templateData.id,
				data: {
					draft: false,
				},
			});

			addNotificationEvent({
				type: NotificationType.roomPublished,
				message: 'templates.published',
				messageOptions: {
					templateName: templateData?.name,
				},
			});
		}
	}, [templateData?.name]);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={publishRoomDialog}
		>
			<CustomGrid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<CustomTypography variant="h4bold">
					<Translation
						nameSpace="rooms"
						translation="publishRoomDialog.title"
						options={{
							templateName: templateData?.name,
						}}
					/>
				</CustomTypography>

				<CustomTypography textAlign="center">
					<Translation
						nameSpace="rooms"
						translation="publishRoomDialog.text"
					/>
				</CustomTypography>

				<ButtonsGroup className={styles.buttons}>
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
					<CustomButton
						onClick={handlePublishRoom}
						label={
							<Translation
								nameSpace="common"
								translation="buttons.publish"
							/>
						}
					/>
				</ButtonsGroup>
			</CustomGrid>
		</CustomDialog>
	);
};

export const PublishRoomDialog = memo(Component);
