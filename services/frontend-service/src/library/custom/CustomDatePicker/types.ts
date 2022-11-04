import { PropsWithClassName } from 'shared-frontend/types';

export type CustomDatePickerProps = PropsWithClassName<{
    onDateSelected: (date: Date) => void;
    startDate: Date;
    selected?: Date;
    blockedDate: Date;
}>;
