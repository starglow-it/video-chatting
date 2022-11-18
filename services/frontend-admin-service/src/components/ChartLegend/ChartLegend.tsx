import { memo, useMemo } from 'react';
import { PropsWithClassName } from 'shared-frontend/types';

import { CustomGrid, CustomBox, CustomTypography } from 'shared-frontend/library';

import styles from './ChartLegend.module.scss';

type ChartLegendProps = {
    totalNumber: number;
    dataSets: {
        label: string;
        parts: number;
        color: string;
    }[];
};

type ChartLegendItemProps = {
    totalNumber: number;
    data: {
        label: string;
        parts: number;
        color: string;
    };
};

const ChartLegendItem = ({ data, totalNumber }: ChartLegendItemProps) => {
    const partsValue = useMemo(
        () => (Array.isArray(data.parts) ? data.parts.reduce((acc, b) => acc + b, 0) : data.parts),
        [data.parts],
    );

    return (
        <CustomGrid container direction="column" flex="0 0 50%" width="auto">
            <CustomBox className={styles.colorIndicator} sx={{ backgroundColor: data.color }} />
            <CustomTypography color="colors.black.light" className={styles.text}>
                {data.label}
            </CustomTypography>
            <CustomGrid container alignItems="center" gap={1}>
                <CustomTypography variant="h4bold">
                    {`${((partsValue / totalNumber) * 100).toFixed(2)}%`}
                </CustomTypography>
                &#8226;
                <CustomTypography color="colors.black.light">{partsValue}</CustomTypography>
            </CustomGrid>
        </CustomGrid>
    );
};

const Component = ({ totalNumber, dataSets, className }: PropsWithClassName<ChartLegendProps>) => {
    const renderData = useMemo(
        () =>
            dataSets.map(set => (
                <ChartLegendItem key={set.label} data={set} totalNumber={totalNumber} />
            )),
        [dataSets, totalNumber],
    );

    return (
        <CustomGrid container rowGap={3} className={className}>
            {renderData}
        </CustomGrid>
    );
};

export const ChartLegend = memo(Component);
