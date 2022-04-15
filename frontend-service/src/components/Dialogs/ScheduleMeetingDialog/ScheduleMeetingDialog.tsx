import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

import { MenuItem } from '@mui/material';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDatePicker } from '@library/custom/CustomDatePicker/CustomDatePicker';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// helpers
import { getDateTimestamp } from '../../../utils/time/getDateTimestamp';
import { getTimeList, getTimestamp, TIMEZONES } from '../../../utils/timezones';
import { parseTimestamp } from '../../../utils/time/parseTimestamp';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import {
    $scheduleTemplateIdStore,
    sendScheduleInviteFx,
    setScheduleTemplateIdEvent,
} from '../../../store/templates';

// types
import { AppDialogsEnum } from '../../../store/types';

// validations
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';
import { simpleStringSchema, simpleStringSchemaWithLength } from '../../../validation/common';

// styles
import styles from './ScheduleMeetingDialog.module.scss';

// const
import { ONE_MINUTE } from '../../../const/time/common';

const validationSchema = yup.object({
    timeZone: simpleStringSchema().required('required'),
    startAt: simpleStringSchema().required('required'),
    endAt: simpleStringSchema().required('required'),
    comment: simpleStringSchemaWithLength(500),
    date: simpleStringSchema().required('required'),
});

const timeList = getTimeList(15 * ONE_MINUTE);

function Component() {
    const { scheduleMeetingDialog } = useStore($appDialogsStore);
    const isScheduleMeetingInProgress = useStore(sendScheduleInviteFx.pending);

    const scheduleTemplateId = useStore($scheduleTemplateIdStore);

    const resolver = useYupValidationResolver<{
        timeZone: string;
        date: string;
        startAt: string;
        endAt: string;
        comment: string;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            timeZone: TIMEZONES[0].tzCode,
            startAt: '00:00',
            endAt: '00:00',
            comment: '',
            date: new Date(),
        },
    });

    const { handleSubmit, control, setValue, register, reset } = methods;

    const timeZoneValue = useWatch({
        control,
        name: 'timeZone',
    });

    const selectedDate = useWatch({
        control,
        name: 'date',
    });

    const startAtValue = useWatch({
        control,
        name: 'startAt',
    });

    const endAtValue = useWatch({
        control,
        name: 'endAt',
    });

    useEffect(() => {
        if (getTimestamp(startAtValue) > getTimestamp(endAtValue)) {
            setValue('endAt', startAtValue, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [startAtValue, endAtValue]);

    const handleChange = useCallback(event => {
        setValue('timeZone', event.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const handleChangeStartAt = useCallback(event => {
        setValue('startAt', event.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const handleChangeEndAt = useCallback(event => {
        setValue('endAt', event.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const renderTimezoneList = useMemo(
        () =>
            TIMEZONES.map(timezone => (
                <MenuItem key={timezone.tzCode} value={timezone.tzCode}>
                    {timezone.name}
                </MenuItem>
            )),
        [],
    );

    const renderTimeList = useMemo(
        () =>
            timeList.map(time => (
                <MenuItem key={time} value={time}>
                    {time}
                </MenuItem>
            )),
        [],
    );

    const { onChange, ...restRegisterData } = register('comment', { maxLength: 500 });
    const restDateRegisterData = register('date');

    const handleChangeComment = useCallback(async event => {
        if (event.target.value.length > 500) {
            event.target.value = event.target.value.slice(0, 500);
        }

        await onChange(event);
    }, []);

    const handleClose = useCallback(() => {
        reset();

        setScheduleTemplateIdEvent('');

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
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
            });

            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.scheduleMeetingDialog,
            });
        }),
        [scheduleTemplateId],
    );

    const handleSelectDate = useCallback((date: Date) => {
        setValue('date', date, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const renderTimezonesValue = useCallback(
        selected => TIMEZONES.find(timezone => timezone.tzCode === selected)?.name,
        [],
    );

    const renderTimeValue = useCallback(selected => selected, []);

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
                        <CustomGrid className={styles.rightSide}>
                            <CustomGrid container gap={4}>
                                <CustomDropdown
                                    nameSpace="forms"
                                    translation="editTimezone"
                                    selectId="timezoneSelect"
                                    labelId="timezone"
                                    {...register('timeZone')}
                                    value={timeZoneValue}
                                    onChange={handleChange}
                                    renderValue={renderTimezonesValue}
                                    list={renderTimezoneList}
                                />
                                <CustomGrid container wrap="nowrap" alignItems="center" gap={2}>
                                    <CustomDropdown
                                        nameSpace="forms"
                                        translation="startAt"
                                        selectId="startAtSelect"
                                        labelId="startAt"
                                        {...register('startAt')}
                                        value={startAtValue}
                                        renderValue={renderTimeValue}
                                        list={renderTimeList}
                                        onChange={handleChangeStartAt}
                                    />
                                    <CustomTypography variant="body1bold">&#45;</CustomTypography>
                                    <CustomDropdown
                                        nameSpace="forms"
                                        translation="endAt"
                                        selectId="endAtSelect"
                                        labelId="endAt"
                                        {...register('endAt')}
                                        value={endAtValue}
                                        renderValue={renderTimeValue}
                                        list={renderTimeList}
                                        onChange={handleChangeEndAt}
                                    />
                                </CustomGrid>
                                <CustomInput
                                    nameSpace="forms"
                                    translation="comment"
                                    multiline
                                    rows={4}
                                    onChange={handleChangeComment}
                                    {...restRegisterData}
                                />
                                <CustomGrid
                                    container
                                    wrap="nowrap"
                                    gap={2}
                                    className={styles.buttons}
                                >
                                    <CustomButton
                                        nameSpace="common"
                                        translation="buttons.cancel"
                                        variant="custom-cancel"
                                        onClick={handleClose}
                                    />
                                    <CustomButton
                                        disabled={isScheduleMeetingInProgress}
                                        nameSpace="common"
                                        translation="buttons.schedule"
                                        type="submit"
                                    />
                                </CustomGrid>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        </CustomDialog>
    );
}

const ScheduleMeetingDialog = memo(Component);

export { ScheduleMeetingDialog };
