import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { MenuItem } from '@mui/material';

// custom
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// const
import { TIMEZONES } from '../../../const/time/timezones';
import { ONE_MINUTE } from '../../../const/time/common';

// utils
import {
    getHourMinutesString,
    getTimeList,
    getTimestamp,
    getTimeString,
} from '../../../utils/timezones';
import { parseTimestamp } from '../../../utils/time/parseTimestamp';
import { isDatesEqual } from '../../../utils/time/isDatesEqual';
import { setDayTime } from '../../../utils/time/setTimeFunctions';

// types
import { PropsWithClassName } from '../../../types';

// styles
import styles from './ScheduleMeetingDialog.module.scss';

const Component = ({
    className,
    currentDate,
}: PropsWithClassName<{ currentDate: Date | number }>) => {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext();

    const timeZoneValue = useWatch({
        control,
        name: 'timeZone',
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
        const isTheSameDay = isDatesEqual(setDayTime(currentDate), setDayTime(new Date()));

        const startTime = isTheSameDay ? getHourMinutesString(parseTimestamp(Date.now())) : '00:00';

        setValue('startAt', getTimeList(startTime, 30 * ONE_MINUTE, 0, '24:00')[0], {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

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

    const renderTimeList = useMemo(() => {
        const isTheSameDay = isDatesEqual(setDayTime(currentDate), setDayTime(new Date()));

        const startTime = isTheSameDay ? getHourMinutesString(parseTimestamp(Date.now())) : '00:00';

        return getTimeList(startTime, 30 * ONE_MINUTE, 0, '23:30').map(time => (
            <MenuItem key={time} value={time}>
                {time}
            </MenuItem>
        ));
    }, [currentDate]);

    const renderEndTimeList = useMemo(() => {
        const isTheSameDay = isDatesEqual(setDayTime(currentDate), setDayTime(new Date()));

        const startTime = isTheSameDay
            ? getHourMinutesString(parseTimestamp(Date.now() + 30 * ONE_MINUTE))
            : '00:00';

        const timeString = getTimeString(getTimestamp(startAtValue) + 30 * ONE_MINUTE);

        return getTimeList(
            (startAtValue && timeString) || startTime,
            30 * ONE_MINUTE,
            3,
            '24:00',
        ).map(time => (
            <MenuItem key={time} value={time}>
                {time}
            </MenuItem>
        ));
    }, [startAtValue, currentDate]);

    const { onChange, ...restRegisterData } = register('comment', { maxLength: 500 });

    const registerStartAt = register('startAt');

    const handleChangeComment = useCallback(async event => {
        if (event.target.value.length > 500) {
            event.target.value = event.target.value.slice(0, 500);
        }

        await onChange(event);
    }, []);

    const renderTimezonesValue = useCallback(
        selected => TIMEZONES.find(timezone => timezone.tzCode === selected)?.name,
        [],
    );

    const renderTimeValue = useCallback(selected => selected, []);

    useEffect(() => {
        if (startAtValue) {
            setValue('endAt', getTimeString(getTimestamp(startAtValue) + 30 * ONE_MINUTE), {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [startAtValue]);

    return (
        <CustomGrid className={className} container gap={4}>
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
                    {...registerStartAt}
                    value={startAtValue}
                    renderValue={renderTimeValue}
                    list={renderTimeList}
                    onChange={handleChangeStartAt}
                    error={errors?.startAt?.[0]?.message}
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
                    list={renderEndTimeList}
                    onChange={handleChangeEndAt}
                    error={errors?.endAt?.[0]?.message}
                />
            </CustomGrid>
            <CustomInput
                nameSpace="forms"
                translation="comment"
                multiline
                rows={4}
                onChange={handleChangeComment}
                InputProps={{
                    classes: {
                        root: styles.input,
                    },
                }}
                {...restRegisterData}
            />
        </CustomGrid>
    );
};

export const ScheduleTime = memo(Component);
