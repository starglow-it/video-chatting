import React, { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomVideoPlayerOptions } from '@library/custom/CustomVideoPlayer/types';

// styles
import { CustomVideoPlayer } from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// types
import { MeetingBackgroundVideoProps } from './types';

// stores
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isScreenSharingStore,
} from '../../../store/roomStores';

// styles
import styles from './MeetingBackgroundVideo.module.scss';

const Component = ({ children, src, templateType }: MeetingBackgroundVideoProps) => {
    const isScreenSharing = useStore($isScreenSharingStore);
    const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    const videoJsOptions = useMemo(
        (): CustomVideoPlayerOptions => ({
            src,
            type: 'video/mp4',
        }),
        [src],
    );

    return (
        <ConditionalRender condition={Boolean(src)}>
            <CustomGrid className={styles.backgroundVideo}>
                <ConditionalRender condition={templateType === 'video'}>
                    <CustomVideoPlayer
                        isPlaying={!isScreenSharing}
                        isMuted={!isAudioBackgroundActive}
                        volume={backgroundAudioVolume}
                        options={videoJsOptions}
                        className={styles.player}
                    />
                </ConditionalRender>
                {children}
            </CustomGrid>
        </ConditionalRender>
    );
};

export const MeetingBackgroundVideo = memo(Component);
