import { ValuesSwitcherItem } from 'shared-frontend/types';

import {
	IMonetizationStatistic,
	MonetizationStatisticPeriods,
} from 'shared-types';

export type MonetizationStatisticsProps = {
    titleKey: string;
    isDataLoading: boolean;
    statistic: {
        totalNumber: number;
        data: IMonetizationStatistic[];
    };
    periods: ValuesSwitcherItem<MonetizationStatisticPeriods>[];
    currentPeriod: ValuesSwitcherItem<MonetizationStatisticPeriods>;
    onChangePeriod: (
        value: ValuesSwitcherItem<MonetizationStatisticPeriods>,
    ) => void;
};
