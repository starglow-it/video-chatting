import { ValuesSwitcherItem } from 'shared-frontend';
import { MonetizationStatisticPeriods } from 'shared-types';

export type MonetizationStatisticsProps = {
    titleKey: string;
    statistic: {
        totalNumber: number;
        data: Record<string, any>[];
    };
    periods: ValuesSwitcherItem<MonetizationStatisticPeriods>[];
    currentPeriod: ValuesSwitcherItem<MonetizationStatisticPeriods>;
    onChangePeriod: (value: ValuesSwitcherItem<MonetizationStatisticPeriods>) => void;
};
