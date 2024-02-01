import { ValuesSwitcherItem } from 'shared-frontend/types';
import { MonetizationStatisticPeriods } from 'shared-types';

export const schedulePages: ValuesSwitcherItem<MonetizationStatisticPeriods>[] =
    [
        {
            id: 1,
            value: MonetizationStatisticPeriods.Month,
            label: 'Last month',
        },
        {
            id: 2,
            value: MonetizationStatisticPeriods.AllTime,
            label: 'All time',
        },
    ];

export enum StatisticsTabsValues {
    Users = 'users',
    QA = 'qa',
    Links = 'links',
    Monetization = 'monetization',
}

export const statisticTabs: { value: string; translationKey: string }[] = [
    {
        value: StatisticsTabsValues.Users,
        translationKey: 'users',
    },
    {
        value: StatisticsTabsValues.QA,
        translationKey: 'qa',
    },
    {
        value: StatisticsTabsValues.Links,
        translationKey: 'links',
    },
    {
        value: StatisticsTabsValues.Monetization,
        translationKey: 'monetization',
    },
];
