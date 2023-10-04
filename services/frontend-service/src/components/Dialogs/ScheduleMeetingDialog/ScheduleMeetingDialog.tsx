import { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

// hooks
import { useMultipleToggle } from '@hooks/useMultipleToggle';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomDatePicker } from '@library/custom/CustomDatePicker/CustomDatePicker';

// components
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { ScheduleTime } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleTime';
import { Translation } from '@library/common/Translation/Translation';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import CustomDivider from 'shared-frontend/library/custom/CustomDivider/CustomDivider';
import CustomFade from 'shared-frontend/library/custom/CustomFade/CustomFade';
import CustomButton from 'shared-frontend/library/custom/CustomButton/CustomButton';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { MeetingRoleGroup } from '@components/Meeting/MeetingRoleGroup/MeetingRoleGroup';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ScheduleAttendees } from './ScheduleAttendees';

// helpers
import { getDateTimestamp } from '../../../utils/time/getDateTimestamp';
import { parseTimestamp } from '../../../utils/time/parseTimestamp';
import { getTimeZone } from '../../../utils/time/getTimeZone';

// stores
import {
    appDialogsApi,
    $appDialogsStore,
    $scheduleTemplateIdStore,
    sendScheduleInviteFx,
    setScheduleTemplateIdEvent,
} from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// validations
import {
    simpleStringSchema,
    simpleStringSchemaWithLength,
} from '../../../validation/common';
import { emailSchema } from '../../../validation/users/email';

// styles
import styles from './ScheduleMeetingDialog.module.scss';

const validationSchema = yup.object({
    timeZone: simpleStringSchema().required('required'),
    startAt: simpleStringSchema().required('required'),
    endAt: simpleStringSchema().required('required'),
    comment: simpleStringSchemaWithLength(500),
    currentUserEmail: emailSchema(),
    date: yup.date().required('required'),
});

const schedulePages: ValuesSwitcherItem<string>[] = [
    {
        id: 1,
        value: 'settings',
        label: 'Settings',
    },
    {
        id: 2,
        value: 'invite',
        label: 'Invite others',
    },
];

type FormType = {
    timeZone: string;
    date: Date;
    startAt: string;
    endAt: string;
    comment: string;
    currentUserEmail: string;
};

const Component = () => {
    const { scheduleMeetingDialog } = useStore($appDialogsStore);
    const scheduleTemplateId = useStore($scheduleTemplateIdStore);

    const isScheduleMeetingInProgress = useStore(sendScheduleInviteFx.pending);

    const [activeSchedulePage, setActiveSchedulePage] = useState(
        schedulePages[0],
    );
    const [userEmails, setUserEmails] = useState<string[]>([]);

    const {
        values: { isSettingsOpen, isInviteOpen },
        onSwitchOn: handleOpenOption,
    } = useMultipleToggle(['isSettingsOpen', 'isInviteOpen'], 'isSettingsOpen');

    const resolver = useYupValidationResolver<FormType>(validationSchema);

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

    const { handleSubmit, control, setValue, register, trigger, reset } =
        methods;

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
            } catch (e) {
                console.log(e);
            }
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

    const handleChangeSchedulePage = useCallback(
        async (newValue: ValuesSwitcherItem<string>) => {
            const isThereNoErrors = await trigger(['startAt', 'endAt']);

            if (isThereNoErrors) {
                setActiveSchedulePage(newValue);
                handleOpenOption(
                    newValue.value === 'settings'
                        ? 'isSettingsOpen'
                        : 'isInviteOpen',
                );
            }
        },
        [],
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
                                blockedDate={new Date()}
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
                                values={schedulePages}
                                activeValue={activeSchedulePage}
                                onValueChanged={handleChangeSchedulePage}
                                className={styles.switcher}
                            />
                            <CustomGrid className={styles.optionsWrapper}>
                                <CustomFade
                                    open={isSettingsOpen}
                                    className={styles.optionItem}
                                >
                                    <ScheduleTime
                                        currentDate={selectedDate}
                                        blockedDate={new Date()}
                                    />
                                </CustomFade>
                                <CustomFade
                                    open={isInviteOpen}
                                    className={styles.optionItem}
                                >
                                    <ScheduleAttendees
                                        onAddUserEmail={handleAddUserEmail}
                                        onDeleteUserEmail={
                                            handleDeleteUserEmail
                                        }
                                        userEmails={userEmails}
                                    />
                                </CustomFade>
                            </CustomGrid>
                            <ConditionalRender condition={isInviteOpen}>
                                <MeetingRoleGroup
                                    className={styles.roleGroup}
                                />
                            </ConditionalRender>
                            <CustomGrid
                                container
                                wrap="nowrap"
                                gap={2}
                                className={styles.buttons}
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
                                    className={clsx({
                                        [styles.hide]: isInviteOpen,
                                    })}
                                    label={
                                        <Translation
                                            nameSpace="common"
                                            translation="buttons.continue"
                                        />
                                    }
                                    onClick={handleShowEnterEmails}
                                />
                                <CustomButton
                                    className={clsx({
                                        [styles.hide]: !isInviteOpen,
                                    })}
                                    disabled={
                                        isScheduleMeetingInProgress ||
                                        !userEmails?.length
                                    }
                                    onClick={onSubmit}
                                    label={
                                        <Translation
                                            nameSpace="common"
                                            translation="buttons.schedule"
                                        />
                                    }
                                />
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        </CustomDialog>
    );
};

export const ScheduleMeetingDialog = memo(Component);
