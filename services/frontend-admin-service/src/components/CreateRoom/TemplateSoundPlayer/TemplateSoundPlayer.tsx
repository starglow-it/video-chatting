import React, {memo, useCallback, useMemo } from "react";

import {formatCountDown, getRandomNumber} from "shared-utils";

import {CustomBox} from "shared-frontend/library/custom/CustomBox";
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {CustomAudio} from "@components/CreateRoom/CustomAudio/CustomAudio";

import {useTimer} from "shared-frontend/hooks/useTimer";

import styles from './TemplateSoundPlayer.module.scss';

const Component = ({ fileName, src }: { fileName: string; src: string }) => {
    const {
        value: currentTime,
        onStartTimer: handleStartAudio,
        onEndTimer: handleStopAudio,
    } = useTimer(true);

    const handleAudioEnded = useCallback(() => {
        handleStopAudio();
    }, []);

    const handleAudioStarted = useCallback(({ duration }: { duration: number }) => {
        handleStartAudio(0,  duration * 1000);
    }, []);

    const renderAudioProgress = useMemo(() => {
        return new Array(45).fill(null).map((_, index) => (
            <CustomBox
                key={index}
                className={styles.audioWaveItem}
                style={{ height: `${getRandomNumber(100, 10)}%` }}
            />
        ));
    }, []);

    return (
        <CustomGrid container direction="column" gap={2.5}>
            <CustomGrid
                container
                alignItems="flex-end"
                justifyContent="space-between"
                className={styles.audioWave}
            >
                {renderAudioProgress}
            </CustomGrid>
            <CustomGrid container justifyContent="space-between" className={styles.audioInfo}>
                <CustomTypography color="colors.white.primary" className={styles.audioName}>
                    {fileName}
                </CustomTypography>

                <CustomTypography color="colors.white.primary">
                    {formatCountDown(currentTime, { minutes: true, seconds: true })}
                </CustomTypography>

                <CustomAudio
                    src={src}
                    onEnded={handleAudioEnded}
                    onStarted={handleAudioStarted}
                />
            </CustomGrid>
        </CustomGrid>
    );
}

export const TemplateSoundPlayer = memo(Component);