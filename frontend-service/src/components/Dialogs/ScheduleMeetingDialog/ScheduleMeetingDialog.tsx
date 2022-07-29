import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

// hooks

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDatePicker } from '@library/custom/CustomDatePicker/CustomDatePicker';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';
import { CustomFade } from '@library/custom/CustomFade/CustomFade';

// components
import { ValuesSwitcher } from '@library/common/ValuesSwitcher/ValuesSwitcher';
import { ScheduleTime } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleTime';
import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { getTimeZone } from 'src/utils/time/getTimeZone';
import { ScheduleAttendees } from './ScheduleAttendees';

// helpers
import { getDateTimestamp } from '../../../utils/time/getDateTimestamp';
import { parseTimestamp } from '../../../utils/time/parseTimestamp';
import { useMultipleToggle } from '../../../hooks/useMultipleToggle';
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store';
import {
    $scheduleTemplateIdStore,
    sendScheduleInviteFx,
    setScheduleTemplateIdEvent,
} from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// validations
import { simpleStringSchema, simpleStringSchemaWithLength } from '../../../validation/common';
import { emailSchema } from '../../../validation/users/email';

// styles
import styles from './ScheduleMeetingDialog.module.scss';

const validationSchema = yup.object({
    timeZone: simpleStringSchema().required('required'),
    startAt: simpleStringSchema().required('required'),
    endAt: simpleStringSchema().required('required'),
    comment: simpleStringSchemaWithLength(500),
    currentUserEmail: emailSchema(),
    date: simpleStringSchema().required('required'),
});

const schedulePages: ValuesSwitcherItem[] = [
    { id: 1, value: 'settings', label: 'Settings' },
    { id: 2, value: 'invite', label: 'Invite others' },
];

const Component = () => {
    const { scheduleMeetingDialog } = useStore($appDialogsStore);
    const isScheduleMeetingInProgress = useStore(sendScheduleInviteFx.pending);
    const scheduleTemplateId = useStore($scheduleTemplateIdStore);

    const [activeSchedulePage, setActiveSchedulePage] = useState(schedulePages[0]);
    const [userEmails, setUserEmails] = useState<string[]>([]);

    const {
        values: { isSettingsOpen, isInviteOpen },
        onSwitchOn: handleOpenOption,
    } = useMultipleToggle(['isSettingsOpen', 'isInviteOpen'], 'isSettingsOpen');

    const resolver = useYupValidationResolver<{
        timeZone: string;
        date: string;
        startAt: string;
        endAt: string;
        comment: string;
        currentUserEmail: string;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            timeZone: getTimeZone(),
            startAt: '',
            endAt: '',
            comment: '',
            currentUserEmail: '',
            date: new Date(),
        },
    });

    const { handleSubmit, control, setValue, register, trigger, reset } = methods;

    const selectedDate = useWatch({
        control,
        name: 'date',
    });

    const restDateRegisterData = register('date');

    useEffect(() => {
        if (scheduleMeetingDialog) {
            handleOpenOption('isSettingsOpen');
            setActiveSchedulePage(schedulePages[0]);
            setUserEmails([]);
        }
    }, [scheduleMeetingDialog]);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });

        reset();
        setScheduleTemplateIdEvent('');
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            try {
                const startAtTime = getDateTimestamp(data.date, data.startAt);
                const endAtTime = getDateTimestamp(data.date, data.endAt);

                const parsedStartAt = parseTimestamp(startAtTime);
                const parsedEndAt = parseTimestamp(endAtTime);

                await sendScheduleInviteFx({
                    templateId: scheduleTemplateId,
                    startAt: parsedStartAt,
                    endAt: parsedEndAt,
                    comment: data.comment,
                    timeZone: data.timeZone,
                    userEmails,
                });

                handleClose();
            } catch (e) {}
        }),
        [scheduleTemplateId, userEmails],
    );

    const handleSelectDate = useCallback((date: Date) => {
        setValue('date', date, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const handleShowEnterEmails = useCallback(async () => {
        const isThereNoErrors = await trigger(['startAt', 'endAt']);

        if (isThereNoErrors) {
            handleOpenOption('isInviteOpen');
            setActiveSchedulePage(schedulePages[1]);
        }
    }, []);

    const handleChangeSchedulePage = useCallback(async (newValue: ValuesSwitcherItem) => {
        const isThereNoErrors = await trigger(['startAt', 'endAt']);

        if (isThereNoErrors) {
            setActiveSchedulePage(newValue);
            handleOpenOption(newValue.value === 'settings' ? 'isSettingsOpen' : 'isInviteOpen');
        }
    }, []);

    const handleAddUserEmail = useCallback(newEmail => {
        setUserEmails(prev => {
            if (!prev.some(email => email === newEmail)) {
                return [...prev, newEmail];
            }

            return prev;
        });
    }, []);

    const handleDeleteUserEmail = useCallback(oldEmail => {
        setUserEmails(prev => prev.filter(email => email !== oldEmail));
    }, []);

    return (
        <CustomDialog
            open={scheduleMeetingDialog}
            onBackdropClick={handleClose}
            contentClassName={styles.content}
            maxWidth="lg"
        >
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <CustomGrid container wrap="nowrap">
                        <CustomGrid className={styles.leftSide}>
                            <CustomDatePicker
                                className={styles.datePicker}
                                selected={selectedDate}
                                startDate={new Date()}
                                onDateSelected={handleSelectDate}
                                {...restDateRegisterData}
                            />
                        </CustomGrid>
                        <CustomDivider orientation="vertical" flexItem />
                        <CustomGrid
                            className={styles.rightSide}
                            container
                            direction="column"
                            alignItems="center"
                        >
                            <ValuesSwitcher
                                optionWidth={134}
                                values={schedulePages}
                                activeValue={activeSchedulePage}
                                onValueChanged={handleChangeSchedulePage}
                            />
                            <CustomGrid className={styles.optionsWrapper}>
                                <CustomFade open={isSettingsOpen} className={styles.optionItem}>
                                    <ScheduleTime currentDate={selectedDate} />
                                </CustomFade>
                                <CustomFade open={isInviteOpen} className={styles.optionItem}>
                                    <ScheduleAttendees
                                        onAddUserEmail={handleAddUserEmail}
                                        onDeleteUserEmail={handleDeleteUserEmail}
                                        userEmails={userEmails}
                                    />
                                </CustomFade>
                            </CustomGrid>
                            <CustomGrid container wrap="nowrap" gap={2} className={styles.buttons}>
                                <CustomButton
                                    nameSpace="common"
                                    translation="buttons.cancel"
                                    variant="custom-cancel"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    className={clsx({ [styles.hide]: isInviteOpen })}
                                    nameSpace="common"
                                    translation="buttons.continue"
                                    onClick={handleShowEnterEmails}
                                />
                                <CustomButton
                                    className={clsx({ [styles.hide]: !isInviteOpen })}
                                    disabled={isScheduleMeetingInProgress || !userEmails?.length}
                                    nameSpace="common"
                                    translation="buttons.schedule"
                                    onClick={onSubmit}
                                />
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        </CustomDialog>
    );
};

const ScheduleMeetingDialog = memo(Component);

export { ScheduleMeetingDialog };
