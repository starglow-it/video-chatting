import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import clsx from 'clsx';

// shared
import { RoundArrowIcon } from 'shared-frontend/icons/RoundIcons/RoundArrowIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// time utils
import { formatDate } from '../../../utils/time/formatDate';
import { getNextMonth } from '../../../utils/time/getNextMonth';
import { getCalendarMonthData } from '../../../utils/time/getCalendarMonthData';
import { isWeekendDay } from '../../../utils/time/isWeekendDay';
import { isCurrentMonthDay } from '../../../utils/time/isCurrentMonthDay';
import { isDatesEqual } from '../../../utils/time/isDatesEqual';
import { isBefore } from '../../../utils/time/isBefore';
import { isTodayDate } from '../../../utils/time/isToday';
import { getPreviousMonth } from '../../../utils/time/getPreviousMonth';
import { getDaysOfWeek } from '../../../utils/time/getDaysOfWeek';

// custom
import { CustomTypography } from '../CustomTypography/CustomTypography';

// stores
import { addNotificationEvent } from '../../../store';

// types
import { CustomDatePickerProps } from './types';
import { NotificationType } from '../../../store/types';

// styles
import styles from './CustomDatePicker.module.scss';

const Component = (
    {
        selected,
        startDate,
        className,
        onDateSelected,
        blockedDate,
    }: CustomDatePickerProps,
    ref,
) => {
    const [selectedDate, setSelectedDate] = useState<Date>(
        selected || new Date(),
    );
    const [currentMonthDate, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        setCurrentMonth(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (isBefore(selectedDate, blockedDate)) {
            setSelectedDate(blockedDate);
            onDateSelected(blockedDate);
        }
    }, []);

    const handleSetPrevMonth = useCallback(() => {
        setCurrentMonth(prev => getPreviousMonth(prev));
    }, []);

    const handleSetNextMonth = useCallback(() => {
        setCurrentMonth(prev => getNextMonth(prev));
    }, []);

    const handleChangeSelectDate = useCallback((date: Date) => {
        setSelectedDate(() => date);
        onDateSelected?.(date);
    }, []);

    const weekDays = useMemo(
        () =>
            getDaysOfWeek().map(dayOfWeek => {
                const key = formatDate(dayOfWeek, 'EEEEEE');

                return (
                    <CustomTypography
                        key={key}
                        variant="body1bold"
                        color={
                            isWeekendDay(dayOfWeek)
                                ? 'colors.grayscale.normal'
                                : 'colors.black.primary'
                        }
                    >
                        {key}
                    </CustomTypography>
                );
            }),
        [],
    );

    const renderMonth = useMemo(() => {
        const monthData = getCalendarMonthData(currentMonthDate);

        return monthData.map(week => {
            const renderWeeks = week.map(weekDay => {
                const isActiveDate = isCurrentMonthDay(
                    currentMonthDate,
                    weekDay,
                );

                const isDateBefore =
                    isBefore(weekDay, startDate) && !isTodayDate(weekDay);
                const isEqual = isDatesEqual(weekDay, selectedDate);
                const isBlockedDate =
                    isBefore(weekDay, blockedDate) &&
                    !isDatesEqual(weekDay, blockedDate);

                const day = formatDate(weekDay, 'd');

                const handleChooseWeekDay = () => {
                    if (!isDateBefore && !isBlockedDate) {
                        handleChangeSelectDate(weekDay);
                        return;
                    }

                    if (
                        isBlockedDate &&
                        (!isBefore(weekDay, new Date()) ||
                            isDatesEqual(weekDay, new Date()))
                    ) {
                        addNotificationEvent({
                            type: NotificationType.SubscriptionEndDate,
                            message: 'subscriptions.endDate',
                        });
                    }
                };

                return (
                    <CustomGrid
                        key={day}
                        onClick={handleChooseWeekDay}
                        container
                        justifyContent="center"
                        alignItems="center"
                        className={clsx(styles.dayWrapper, {
                            [styles.blocked]: isDateBefore || isBlockedDate,
                            [styles.activeDay]: isEqual,
                        })}
                    >
                        <CustomTypography
                            variant={isEqual ? 'body1bold' : 'body1'}
                            className={clsx(styles.day, {
                                [styles.hideWeekDay]: !isActiveDate,
                            })}
                            color={
                                isDateBefore || isBlockedDate
                                    ? 'colors.grayscale.normal'
                                    : 'colors.black.primary'
                            }
                        >
                            {day}
                        </CustomTypography>
                    </CustomGrid>
                );
            });

            return (
                <CustomGrid
                    key={week?.[0]?.getTime()}
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
            ref={ref}
            container
            gap={4.75}
            alignContent="flex-start"
            className={clsx(styles.calendar, className)}
        >
            <CustomGrid container justifyContent="space-between">
                <RoundArrowIcon
                    width="36px"
                    height="36px"
                    className={styles.leftIcon}
                    onClick={handleSetPrevMonth}
                />
                <CustomTypography variant="h2bold">
                    {formatDate(currentMonthDate, 'MMMM, yyyy')}
                </CustomTypography>
                <RoundArrowIcon
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

export const CustomDatePicker = memo<CustomDatePickerProps>(
    forwardRef(Component),
);
