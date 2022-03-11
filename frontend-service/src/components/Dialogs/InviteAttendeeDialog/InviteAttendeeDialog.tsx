import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { sendInviteEmailFx } from '../../../store/users/init';

import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';

import { AppDialogsEnum } from '../../../store/types';

import styles from './InviteAttendeeDialog.module.scss';

import { emailSchema } from '../../../validation/users/email';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
});

const InviteAttendeeDialog = memo(() => {
    const router = useRouter();
    const { inviteAttendeeByEmailDialog } = useStore($appDialogsStore);

    const resolver = useYupValidationResolver<{ email: string }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
    });

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors },
    } = methods;

    const emailValue = useWatch({
        control,
        name: 'email',
    });

    const onSubmit = handleSubmit(async (data: { email: string }) => {
        await sendInviteEmailFx({ ...data, meetingId: router?.query?.token });
        handleClose();
    });

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
    }, []);

    const handleResetField = useCallback(() => {
        reset({ email: '' });
    }, []);

    const currentEmailErrorMessage: string = errors?.email?.[0]?.message;

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={inviteAttendeeByEmailDialog}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" alignItems="center">
                <CustomGrid container justifyContent="center" className={styles.titleContent}>
                    <CustomBox className={styles.image}>
                        <Image width="30" height="30" src="/images/email.png" alt="email" />
                    </CustomBox>
                    <CustomTypography
                        variant="h4bold"
                        nameSpace="meeting"
                        translation="invite.emailTitle"
                    />
                </CustomGrid>
                <FormProvider {...methods}>
                    <form onSubmit={onSubmit} className={styles.form}>
                        <CustomGrid container>
                            <EmailInput
                                error={currentEmailErrorMessage}
                                onClear={handleResetField}
                                {...register('email')}
                            />
                            <CustomButton
                                disabled={!emailValue}
                                className={styles.button}
                                type="submit"
                                nameSpace="meeting"
                                translation="buttons.send"
                            />
                        </CustomGrid>
                    </form>
                </FormProvider>
            </CustomGrid>
        </CustomDialog>
    );
});

export { InviteAttendeeDialog };
