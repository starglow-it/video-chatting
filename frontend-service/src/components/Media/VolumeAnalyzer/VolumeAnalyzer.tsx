import React, { memo, useContext, useEffect, useMemo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { VolumeIndicator } from '@components/Media/VolumeAnalyzer/VolumeIndicator';
import { useAudioVolumeMeter } from '@hooks/useAudioAnalyzer';
import { MediaContext } from '../../../contexts/MediaContext';

// styles
import styles from './VolumeAnalyzer.module.scss';

const VolumeAnalyzer = memo(({ indicatorsNumber = 6 }: { indicatorsNumber: number }) => {
    const {
        data: { changeStream },
    } = useContext(MediaContext);

    const { volume, onStartVolumeIndicator } = useAudioVolumeMeter(changeStream);

    useEffect(() => {
        onStartVolumeIndicator();
    }, []);

    const indicatorSteps = useMemo(
        () =>
            [...new Array(indicatorsNumber).fill(0).keys()].map((indicator, index, arr) =>
                Math.ceil((100 / arr.length) * index),
            ),
        [indicatorsNumber],
    );

    const renderVolumeIndicator = useMemo(
        () =>
            indicatorSteps.map((indicator, i) => {
                const targetStepIndex = indicatorSteps.findIndex(step => volume <= step);

                const targetStepValue = indicatorSteps[targetStepIndex];

                const prevRangeValue = indicatorSteps[targetStepIndex - 1] || 0;

                const targetRangeValue = targetStepValue - prevRangeValue;
                const volumeRangeValue = volume - prevRangeValue;

                const volumeRangePercent = volumeRangeValue / targetRangeValue;

                const handleActiveIndicator =
                    i < targetStepIndex || i !== 0 ? 1 : volumeRangePercent;

                const currentOpacity = i > targetStepIndex ? 0 : handleActiveIndicator;

                return <VolumeIndicator key={indicator} opacity={currentOpacity} />;
            }),
        [indicatorSteps, volume],
    );

    return (
        <CustomGrid container justifyContent="space-between" className={styles.volumeWrapper}>
            {renderVolumeIndicator}
        </CustomGrid>
    );
});

export { VolumeAnalyzer };
