import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

// styles
import styles from './CustomDatePicker.module.scss';

// custom
import { CustomGrid } from '../CustomGrid/CustomGrid';
import { CustomTypography } from '../CustomTypography/CustomTypography';

// icons
import { ArrowIcon } from '@library/icons/ArrowIcon';

// time utils
import { formatDate } from '../../../utils/time/formatDate';
import { getPreviousMonth } from 'src/utils/time/getPreviousMonth';
import { getNextMonth } from '../../../utils/time/getNextMonth';
import { getDaysOfWeek } from 'src/utils/time/getDaysOfWeek';
import { getCalendarMonthData } from '../../../utils/time/getCalendarMonthData';
import { isWeekendDay } from '../../../utils/time/isWeekendDay';
import { isCurrentMonthDay } from '../../../utils/time/isCurrentMonthDay';
import { isDatesEqual } from '../../../utils/time/isDatesEqual';
import { isBefore } from '../../../utils/time/isBefore';
import { isTodayDate } from '../../../utils/time/isToday';

// types
import { CustomDatePickerProps } from './types';

const Component = ({ selected, startDate, className, onDateSelected }: CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(selected || new Date());
    const [currentMonthDate, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        setCurrentMonth(selectedDate);
    }, [selectedDate]);

    const handleSetPrevMonth = useCallback(() => {
        setCurrentMonth(prev => getPreviousMonth(prev));
    }, []);

    const handleSetNextMonth = useCallback(() => {
        setCurrentMonth(prev => getNextMonth(prev));
    }, []);

    const handleChangeSelectDate = useCallback(date => {
        setSelectedDate(() => date);
        onDateSelected?.(date);
    }, []);

    const weekDays = useMemo(() => {
        return getDaysOfWeek().map(dayOfWeek => {
            const key = formatDate(dayOfWeek, 'EEEEEE');

            return (
                <CustomTypography
                    key={key}
                    variant="body1bold"
                    color={
                        isWeekendDay(dayOfWeek) ? 'colors.grayscale.normal' : 'colors.black.primary'
                    }
                >
                    {key}
                </CustomTypography>
            );
        });
    }, []);

    const renderMonth = useMemo(() => {
        const monthData = getCalendarMonthData(currentMonthDate);

        return monthData.map((week, index) => {
            const renderWeeks = week.map(weekDay => {
                const isActiveDate = isCurrentMonthDay(currentMonthDate, weekDay);

                const isDateBefore = isBefore(weekDay, startDate) && !isTodayDate(weekDay);
                const isEqual = isDatesEqual(weekDay, selectedDate);

                const day = formatDate(weekDay, 'd');

                return (
                    <CustomGrid
                        key={day}
                        onClick={handleChangeSelectDate.bind(null, weekDay)}
                        container
                        justifyContent="center"
                        alignItems="center"
                        className={clsx(styles.dayWrapper, {
                            [styles.blocked]: isDateBefore,
                            [styles.activeDay]: isEqual,
                        })}
                    >
                        <CustomTypography
                            variant={isEqual ? 'body1bold' : 'body1'}
                            className={clsx(styles.day, { [styles.hideWeekDay]: !isActiveDate })}
                            color={
                                isDateBefore ? 'colors.grayscale.normal' : 'colors.black.primary'
                            }
                        >
                            {day}
                        </CustomTypography>
                    </CustomGrid>
                );
            });

            return (
                <CustomGrid
                    key={index}
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    gap={3.5}
                >
                    {renderWeeks}
                </CustomGrid>
            );
        });
    }, [currentMonthDate, selectedDate]);

    return (
        <CustomGrid
            container
            gap={4.75}
            alignContent="flex-start"
            className={clsx(styles.calendar, className)}
        >
            <CustomGrid container justifyContent="space-between">
                <ArrowIcon
                    width="36px"
                    height="36px"
                    className={styles.leftIcon}
                    onClick={handleSetPrevMonth}
                />
                <CustomTypography variant="h2bold">
                    {formatDate(currentMonthDate, 'MMMM, yyyy')}
                </CustomTypography>
                <ArrowIcon
                    width="36px"
                    height="36px"
                    className={styles.rightIcon}
                    onClick={handleSetNextMonth}
                />
            </CustomGrid>
            <CustomGrid container gap={4.5}>
                <CustomGrid container justifyContent="space-between">
                    {weekDays}
                </CustomGrid>
                <CustomGrid container gap={3}>
                    {renderMonth}
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

const CustomDatePicker = memo<CustomDatePickerProps>(
    forwardRef<HTMLDivElement, CustomDatePickerProps>(Component),
);

export { CustomDatePicker };
