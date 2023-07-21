import { memo, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';

// hooks
import { useAudioVolumeMeter } from '@hooks/useAudioAnalyzer';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { VolumeIndicator } from '@components/Media/VolumeAnalyzer/VolumeIndicator';

// styles
import styles from './VolumeAnalyzer.module.scss';

// stores
import { $changeStreamStore } from '../../../store/roomStores';

const Component = ({ indicatorsNumber = 6 }: { indicatorsNumber: number }) => {
    const changeStream = useStore($changeStreamStore);

    const { volume, onStartVolumeIndicator } =
        useAudioVolumeMeter(changeStream);

    useEffect(() => {
        onStartVolumeIndicator();
    }, []);

    const indicatorSteps = useMemo(
        () =>
            [...new Array(indicatorsNumber).fill(0).keys()].map(
                (indicator, index, arr) =>
                    Math.ceil((100 / arr.length) * index),
            ),
        [indicatorsNumber],
    );

    const renderVolumeIndicator = useMemo(
        () =>
            indicatorSteps.map((indicator, i) => {
                const targetStepIndex = indicatorSteps.findIndex(
                    step => volume <= step,
                );

                const targetStepValue = indicatorSteps[targetStepIndex];

                const prevRangeValue = indicatorSteps[targetStepIndex - 1] || 0;

                const targetRangeValue = targetStepValue - prevRangeValue;
                const volumeRangeValue = volume - prevRangeValue;

                const volumeRangePercent = volumeRangeValue / targetRangeValue;

                const handleActiveIndicator =
                    i < targetStepIndex || i !== 0 ? 1 : volumeRangePercent;

                const currentOpacity =
                    i > targetStepIndex ? 0 : handleActiveIndicator;

                return (
                    <VolumeIndicator key={indicator} opacity={currentOpacity} />
                );
            }),
        [indicatorSteps, volume],
    );

    return (
        <CustomGrid
            container
            justifyContent="space-between"
            className={styles.volumeWrapper}
        >
            {renderVolumeIndicator}
        </CustomGrid>
    );
};

export const VolumeAnalyzer = memo(Component);
