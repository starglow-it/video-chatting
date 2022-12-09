import {
	ValuesSwitcherItem 
} from 'shared-frontend/types';
import {
	MonetizationStatisticPeriods 
} from 'shared-types';

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
    Monetization = 'monetization',
    Rooms = 'rooms',
}

export const statisticTabs: { value: string; translationKey: string }[] = [
	{
		value: StatisticsTabsValues.Users,
		translationKey: 'users',
	},
	{
		value: StatisticsTabsValues.Monetization,
		translationKey: 'monetization',
	},
	{
		value: StatisticsTabsValues.Rooms,
		translationKey: 'rooms',
	},
];
