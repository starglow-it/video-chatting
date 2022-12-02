import React, {
	memo, useCallback, useState 
} from 'react';
import {
	useStore 
} from 'effector-react';
import * as yup from 'yup';
import {
	useForm, FormProvider 
} from 'react-hook-form';
import {
	useRouter 
} from 'next/router';

// hooks
import {
	useYupValidationResolver 
} from '@hooks/useYupValidationResolver';

// custom
import {
	CustomDialog 
} from 'shared-frontend/library';
import {
	CustomGrid 
} from 'shared-frontend/library';
import {
	CustomButton 
} from 'shared-frontend/library';

// components
import {
	ScheduleAttendees 
} from '@components/Dialogs/ScheduleMeetingDialog/ScheduleAttendees';

// stores
import {
	Translation 
} from '@library/common/Translation/Translation';
import {
	$appDialogsStore,
	addNotificationEvent,
	appDialogsApi,
} from '../../../store';
import {
	sendInviteEmailFx 
} from '../../../store/roomStores';

// types
import {
	AppDialogsEnum, NotificationType 
} from '../../../store/types';

// styles
import styles from './InviteAttendeeDialog.module.scss';

// validations
import {
	emailSchema 
} from '../../../validation/users/email';

const validationSchema = yup.object({
	currentUserEmail: emailSchema(),
});

const Component = () => {
	const router = useRouter();
	const {
		inviteAttendeeByEmailDialog 
	} = useStore($appDialogsStore);
	const isInviteEmailsSent = useStore(sendInviteEmailFx.pending);

	const [userEmails, setUserEmails] = useState<string[]>([]);

	const resolver = useYupValidationResolver<{ currentUserEmail: string }>(
		validationSchema,
	);

	const methods = useForm({
		criteriaMode: 'all',
		resolver,
	});

	const {
		handleSubmit, 
		reset 
	} = methods;

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
		});
	}, []);

	const onSubmit = useCallback(
		handleSubmit(async () => {
			try {
				await sendInviteEmailFx({
					userEmails,
					meetingId: router?.query?.token,
				});
				reset();
				handleClose();
				setUserEmails([]);

				addNotificationEvent({
					type: NotificationType.InviteSent,
					message: 'meeting.inviteSent',
					withSuccessIcon: true,
				});
			} catch (e) {
				console.log(e);
			}
		}),
		[userEmails],
	);

	const handleAddUserEmail = useCallback((newEmail: string) => {
		setUserEmails(prev => {
			if (!prev.some(email => email === newEmail)) {
				return [...prev, newEmail];
			}

			return prev;
		});
	}, []);

	const handleDeleteUserEmail = useCallback((oldEmail: string) => {
		setUserEmails(prev => prev.filter(email => email !== oldEmail));
	}, []);

	return (
		<CustomDialog
			contentClassName={styles.content}
			open={inviteAttendeeByEmailDialog}
		>
			<FormProvider {...methods}>
				<form
					onSubmit={onSubmit}
					className={styles.form}
				>
					<CustomGrid
						container
						direction="column"
						alignItems="center"
						gap={2}
					>
						<ScheduleAttendees
							className={styles.emails}
							onAddUserEmail={handleAddUserEmail}
							onDeleteUserEmail={handleDeleteUserEmail}
							userEmails={userEmails}
						/>
						<CustomGrid
							container
							wrap="nowrap"
							gap={2}
						>
							<CustomButton
								label={
									<Translation
										nameSpace="common"
										translation="buttons.cancel"
									/>
								}
								variant="custom-cancel"
								onClick={handleClose}
							/>
							<CustomButton
								onClick={onSubmit}
								label={
									<Translation
										nameSpace="meeting"
										translation="invite.sendInvitation"
									/>
								}
								disabled={
									!userEmails?.length || isInviteEmailsSent
								}
							/>
						</CustomGrid>
					</CustomGrid>
				</form>
			</FormProvider>
		</CustomDialog>
	);
};

export const InviteAttendeeDialog = memo(Component);
