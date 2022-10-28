import React, {memo, useEffect} from "react";
import {useStore} from "effector-react";
import Image from 'next/image';

// shared
import { planColors } from 'shared-const';
import { PropsWithClassName } from 'shared-frontend/types';
import {CustomGrid, CustomPaper, CustomTypography} from 'shared-frontend/library';

// components
import {Translation} from "@components/Translation/Translation";
import {CustomDoughnutChart} from "@components/CustomDoughnutChart/CustomDoughnutChart";

// styles
import styles from "./SubscriptionsStatistics.module.scss";

// stores
import {$subscriptionsStatistics, getSubscriptionsStatisticsFx} from "../../../store";

const Component = ({ className }: PropsWithClassName<any>) => {
    const { state: subscriptionsStatistics } = useStore($subscriptionsStatistics);

    console.log(subscriptionsStatistics);

    useEffect(() => {
        (async () => {
            getSubscriptionsStatisticsFx();
        })();
    }, []);

    const data = {
        totalNumber: subscriptionsStatistics.totalNumber,
        dataSets: [
            {
                label: 'House',
                parts: subscriptionsStatistics.subscriptions['house'],
                color: planColors["House"],
            },
            {
                label: 'Professional',
                parts: subscriptionsStatistics.subscriptions['professional'],
                color: planColors["Professional"],
            },
            {
                label: 'Business',
                parts: subscriptionsStatistics.subscriptions['business'],
                color: planColors["Business"],
            }
        ],
    };

    return (
        <CustomPaper className={className}>
            <CustomTypography variant="h4bold">
                <Translation nameSpace="statistics" translation="users.subscription.title" />
            </CustomTypography>
            {subscriptionsStatistics.totalNumber === 0
                ? (
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Image src="/images/eyes.png" width={40} height={40} />
                        <CustomTypography>
                            <Translation
                                nameSpace="statistics"
                                translation="users.subscription.noData"
                            />
                        </CustomTypography>
                    </CustomGrid>
                )
                : (
                    <CustomDoughnutChart
                        className={styles.chartClass}
                        width="180px"
                        height="180px"
                        label="Subscriptions"
                        data={data}
                    />
                )
            }
        </CustomPaper>
    )
}

export const SubscriptionsStatistics = memo(Component);