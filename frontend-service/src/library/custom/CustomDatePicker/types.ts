import { PropsWithClassName } from '../../../types';

export type CustomDatePickerProps = PropsWithClassName<{
    onDateSelected: (date: Date) => void;
    startDate: Date;
    selected?: Date;
}>;
