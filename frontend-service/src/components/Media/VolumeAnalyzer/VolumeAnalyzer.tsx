import React, { memo, useContext, useEffect, useMemo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { VolumeIndicator } from '@components/Media/VolumeAnalyzer/VolumeIndicator';
import { useAudioVolumeMeter } from '@hooks/useAudioAnalyzer';
import { MediaContext } from '../../../contexts/MediaContext';

import styles from './VolumeAnalyzer.module.scss';

const INDICATORS = [...new Array(6).fill(0).keys()];

const INDICATOR_STEPS = [1, 17, 33, 49, 65, 84];

const VolumeAnalyzer = memo(() => {
    const {
        data: { changeStream },
    } = useContext(MediaContext);

    const { volume, onStartVolumeIndicator } = useAudioVolumeMeter(changeStream);

    useEffect(() => {
        onStartVolumeIndicator();
    }, []);

    const renderVolumeIndicator = useMemo(
        () =>
            INDICATORS.map((indicator, i) => {
                const targetStepIndex = INDICATOR_STEPS.findIndex(step => volume <= step);

                const targetStepValue = INDICATOR_STEPS[targetStepIndex];

                const prevRangeValue = INDICATOR_STEPS[targetStepIndex - 1] || 0;

                const targetRangeValue = targetStepValue - prevRangeValue;
                const volumeRangeValue = volume - prevRangeValue;

                const volumeRangePercent = volumeRangeValue / targetRangeValue;

                const handleActiveIndicator =
                    i < targetStepIndex || i !== 0 ? 1 : volumeRangePercent;

                const currentOpacity = i > targetStepIndex ? 0 : handleActiveIndicator;

                return <VolumeIndicator key={indicator} opacity={currentOpacity} />;
            }),
        [volume],
    );

    return (
        <CustomGrid container justifyContent="space-between" className={styles.volumeWrapper}>
            {renderVolumeIndicator}
        </CustomGrid>
    );
});

export { VolumeAnalyzer };
