import { useEffect, memo } from 'react';
import { useStore } from 'effector-react';

//shared
import { PropsWithClassName } from 'shared-frontend/types';
import { getRandomHexColor } from 'shared-utils';

// components
import { CustomPaper, CustomTypography } from 'shared-frontend/library';
import { Translation } from '@components/Translation/Translation';
import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';

// stores
import { $usersStatisticsStore, getUsersStatisticsFx } from '../../../store';

// styles
import styles from './UsersStatistics.module.scss';

const Component = ({ className }: PropsWithClassName<any>) => {
    const { state: usersStatistics } = useStore($usersStatisticsStore);

    useEffect(() => {
        (async () => {
            getUsersStatisticsFx();
        })();
    }, []);

    const data = {
        totalNumber: usersStatistics.totalNumber,
        dataSets: Object.entries(usersStatistics.users).map(([country, data]) => ({
            label: country,
            parts: data,
            color: getRandomHexColor(100, 200)
        })),
    };

    return (
        <CustomPaper className={className}>
            <CustomTypography variant="h4bold">
                <Translation nameSpace="statistics" translation="users.location.title" />
            </CustomTypography>
            <CustomDoughnutChart
                className={styles.chartClass}
                width="180px"
                height="180px"
                label="Users Total"
                data={data}
            />
        </CustomPaper>
    );
};

export const UserStatistics = memo(Component);
