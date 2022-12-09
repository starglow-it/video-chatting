import React, { memo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

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

    return (
        <ConditionalRender condition={Boolean(src)}>
            <CustomGrid className={styles.backgroundVideo}>
                <ConditionalRender condition={templateType === 'video'}>
                    <CustomVideoPlayer
                        isPlaying={!isScreenSharing}
                        isMuted={!isAudioBackgroundActive}
                        volume={backgroundAudioVolume}
                        src={src}
                        className={styles.player}
                    />
                </ConditionalRender>
                {children}
            </CustomGrid>
        </ConditionalRender>
    );
};

export const MeetingBackgroundVideo = memo(Component);
