import React, { memo, useCallback, useEffect, useMemo } from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {MenuItem} from "@mui/material";

import {CustomDropdown} from "@library/custom/CustomDropdown/CustomDropdown";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomInput} from "@library/custom/CustomInput/CustomInput";

import {TIMEZONES} from "../../../const/time/timezones";
import {getTimeList, getTimestamp, getTimeString} from "../../../utils/timezones";
import {ONE_MINUTE} from "../../../const/time/common";
import {PropsWithClassName} from "../../../types";

const timeList = getTimeList('00:00', 30 * ONE_MINUTE);
import styles from './ScheduleMeetingDialog.module.scss';

const Component = ({ className }: PropsWithClassName<any>) => {
    const {
        register,
        control,
        setValue,
        formState: { errors }
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

    const renderEndTimeList = useMemo(
        () =>
            getTimeList(startAtValue, 30 * ONE_MINUTE).map(time => (
                <MenuItem key={time} value={time}>
                    {time}
                </MenuItem>
            )),
        [startAtValue],
    );

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
        []);

    const renderTimeValue = useCallback(selected => selected, []);

    useEffect(() => {
        if (getTimestamp(startAtValue) >= getTimestamp(endAtValue || '00:00')) {
            setValue('endAt', getTimeString(getTimestamp(startAtValue) + 30 * ONE_MINUTE), {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [startAtValue, endAtValue]);

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
                        root: styles.input
                    }
                }}
                {...restRegisterData}
            />
        </CustomGrid>
    )
}

export const ScheduleTime = memo(Component);