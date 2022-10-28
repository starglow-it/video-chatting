import React, {memo, useMemo} from 'react';

import { CustomGrid, CustomTypography, CustomChip } from 'shared-frontend/library';
import { useNavigation } from 'shared-frontend/hooks';
import { Translation } from '@components/Translation/Translation';
import { UserStatistics } from '@components/Statistics/UsersStatistics/UsersStatistics';
import { SubscriptionsStatistics } from '@components/Statistics/SubscriptionsStatistics/SubscriptionsStatistics';

import styles from './UsersStatisticsContainer.module.scss';

const tabs: { value: string; translationKey: string }[] = [
    {
        value: 'users',
        translationKey: 'users'
    },
    {
        value: 'rooms',
        translationKey: 'rooms'
    },
];

const Component = () => {
    const { activeTab, onChange: onChangeTab } = useNavigation({ tabs });

    const renderTabs = useMemo(
        () =>
            tabs.map(({ value, translationKey }) => (
                <CustomChip
                    active={value === activeTab.value}
                    label={(
                        <CustomTypography>
                            <Translation
                                nameSpace="statistics"
                                translation={`pages.${translationKey}.title`}
                            />
                        </CustomTypography>
                    )}
                    onClick={() => onChangeTab(value)}
                />
            )),
        [activeTab, onChangeTab],
    );

    return (
        <CustomGrid container className={styles.wrapper} justifyContent="center">
            <CustomTypography variant="h1">
                <Translation nameSpace="statistics" translation="common.title" />
            </CustomTypography>
            <CustomGrid container alignItems="center">
                {renderTabs}
            </CustomGrid>
            <CustomGrid container justifyContent="center" gap={2}>
                <UserStatistics className={styles.statisticBlock} />
                <SubscriptionsStatistics className={styles.statisticBlock} />
            </CustomGrid>
        </CustomGrid>
    )
};

export const UsersStatisticsContainer = memo(Component);
