import React, {
	memo, useCallback 
} from 'react';
import {
	useStore 
} from 'effector-react';
import {
	FormProvider, useForm 
} from 'react-hook-form';
import * as yup from 'yup';
import {
	ValidationError 
} from 'yup';

// hooks
import {
	useYupValidationResolver 
} from '@hooks/useYupValidationResolver';
import {
	useCountDown 
} from '@hooks/useCountDown';

// custom
import {
	CustomDialog 
} from 'shared-frontend/library';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomGrid 
} from 'shared-frontend/library';
import {
	CustomInput 
} from '@library/custom/CustomInput/CustomInput';
import {
	CustomButton 
} from 'shared-frontend/library';

// stores
import {
	CustomImage 
} from 'shared-frontend/library';
import {
	Translation 
} from '@library/common/Translation/Translation';
import {
	sendResetPasswordLinkFx,
	$appDialogsStore,
	appDialogsApi,
} from '../../../store';

// types
import {
	AppDialogsEnum 
} from '../../../store/types';

// shared

// styles
import styles from './EmailResetPasswordDialog.module.scss';

// validations
import {
	emailSchema 
} from '../../../validation/users/email';

const validationSchema = yup.object({
	email: emailSchema().required('required'),
});

type ResetEmailForm = { email: string };

const Component = () => {
	const {
		emailResetPasswordDialog 
	} = useStore($appDialogsStore);

	const {
		value: timerValue,
		onStartCountDown: handleStartCountDown,
		onStopCountDown: handleStopCountDown,
	} = useCountDown(30);

	const resolver = useYupValidationResolver<ResetEmailForm>(validationSchema);

	const methods = useForm<ResetEmailForm, never>({
		criteriaMode: 'all',
		resolver,
		defaultValues: {
			email: '',
		},
	});

	const {
		reset,
		handleSubmit,
		register,
		formState: {
 errors, 
isSubmitSuccessful, 
isSubmitted 
},
	} = methods;

	const handleClose = useCallback(() => {
		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.emailResetPasswordDialog,
		});
		reset();
		handleStopCountDown();
	}, []);

	const onSubmit = useCallback(
		handleSubmit(async data => {
			await sendResetPasswordLinkFx(data);
			handleStartCountDown();
		}),
		[],
	);

	const emailErrors = errors?.email as unknown as ValidationError[];

	return (
		<CustomDialog
			contentClassName={styles.dialog}
			open={emailResetPasswordDialog}
			onClose={handleClose}
		>
			{isSubmitSuccessful && isSubmitted ? (
				<CustomGrid
					container
					direction="column"
					alignItems="center"
					justifyContent="center"
				>
					<CustomImage
						src="/images/email2.png"
						width="52px"
						height="52px"
					/>
					<CustomTypography
						className={styles.title}
						variant="h2bold"
						nameSpace="common"
						translation="reset.checkEmail"
					/>
					<CustomTypography
						textAlign="center"
						className={styles.text}
						nameSpace="common"
						translation="reset.checkEmailText"
					/>
					<CustomGrid
						container
						justifyContent="center"
						gap={1}
						className={styles.resend}
					>
						<CustomTypography
							nameSpace="common"
							translation="reset.didntGetLink"
						/>
						{timerValue ? (
							<CustomTypography
								nameSpace="common"
								translation="reset.resendTimer"
								color="colors.grayscale.normal"
								options={{
									time: timerValue,
								}}
							/>
						) : (
							<CustomTypography
								variant="body1bold"
								color="colors.blue.primary"
								onClick={onSubmit}
								nameSpace="common"
								translation="reset.resend"
								className={styles.resendButton}
							/>
						)}
					</CustomGrid>
				</CustomGrid>
			) : (
				<>
					<CustomGrid
						container
						direction="column"
						gap={1}
						alignItems="center"
						justifyContent="center"
					>
						<CustomGrid
							container
							alignItems="center"
							gap={1.25}
							justifyContent="center"
						>
							<CustomImage
								src="/images/lock.png"
								width="28px"
								height="28px"
							/>
							<CustomTypography
								variant="h2bold"
								nameSpace="common"
								translation="reset.title"
							/>
						</CustomGrid>
						<CustomTypography
							textAlign="center"
							className={styles.text}
							nameSpace="common"
							translation="reset.text"
						/>
					</CustomGrid>
					<FormProvider {...methods}>
						<form
							onSubmit={onSubmit}
							className={styles.form}
						>
							<CustomGrid
								container
								gap={5}
							>
								<CustomInput
									nameSpace="forms"
									translation="email"
									error={emailErrors?.[0]?.message}
									{...register('email')}
								/>
								<CustomButton
									type="submit"
									label={
										<Translation
											nameSpace="common"
											translation="reset.sendLink"
										/>
									}
								/>
							</CustomGrid>
						</form>
					</FormProvider>
				</>
			)}
		</CustomDialog>
	);
};

export const EmailResetPasswordDialog = memo(Component);
