import React, {memo, useCallback, useState} from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';

import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { sendInviteEmailFx } from '../../../store/users/init';

import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';

import { AppDialogsEnum } from '../../../store/types';

import styles from './InviteAttendeeDialog.module.scss';

import { emailSchema } from '../../../validation/users/email';
import {ScheduleAttendees} from "@components/Dialogs/ScheduleMeetingDialog/ScheduleAttendees";

const validationSchema = yup.object({
    currentUserEmail: emailSchema(),
});

const InviteAttendeeDialog = memo(() => {
    const router = useRouter();
    const { inviteAttendeeByEmailDialog } = useStore($appDialogsStore);
    const isInviteEmailsSent = useStore(sendInviteEmailFx.pending);

    const [userEmails, setUserEmails] = useState<string[]>([]);

    const resolver = useYupValidationResolver<{ currentUserEmail: string }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
    });

    const {
        handleSubmit,
        reset
    } = methods;

    const onSubmit = useCallback(handleSubmit(async () => {
        await sendInviteEmailFx({ userEmails, meetingId: router?.query?.token });
        reset();
        handleClose();
    }),[]);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
    }, []);

    const handleAddUserEmail = useCallback((newEmail) => {
        setUserEmails(prev => {
            if (!prev.some(email => email === newEmail)) {
                return ([...prev, newEmail]);
            }

            return prev;
        });
    },[]);

    const handleDeleteUserEmail = useCallback((oldEmail) => {
        setUserEmails(prev => prev.filter(email => email !== oldEmail));
    },[]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={inviteAttendeeByEmailDialog}
        >
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <CustomGrid container direction="column" alignItems="center" gap={2}>
                        <ScheduleAttendees
                            className={styles.emails}
                            onAddUserEmail={handleAddUserEmail}
                            onDeleteUserEmail={handleDeleteUserEmail}
                            userEmails={userEmails}
                        />
                        <CustomGrid container wrap="nowrap" gap={2}>
                            <CustomButton
                                nameSpace="common"
                                translation="buttons.cancel"
                                variant="custom-cancel"
                                onClick={handleClose}
                            />
                            <CustomButton
                                onClick={onSubmit}
                                nameSpace="meeting"
                                translation="invite.sendInvitation"
                                disabled={!userEmails?.length || isInviteEmailsSent}
                            />
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        </CustomDialog>
    );
});

export { InviteAttendeeDialog };
