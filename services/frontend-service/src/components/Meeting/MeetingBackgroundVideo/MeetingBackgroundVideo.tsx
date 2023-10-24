import { memo } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// types
import { isMobile } from 'shared-utils';
import CustomVideoPlayer from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { MeetingBackgroundVideoProps } from './types';

// stores
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isScreenSharingStore,
} from '../../../store/roomStores';

// styles
import styles from './MeetingBackgroundVideo.module.scss';
import { CustomYoutubePlayer } from '@library/custom/CustomYoutubePlayer/CustomYoutubePlayer';

const Component = ({
    children,
    src,
    templateType,
    videoClassName = '',
}: MeetingBackgroundVideoProps) => {
    const isScreenSharing = useStore($isScreenSharingStore);
    const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    return (
        <ConditionalRender condition={Boolean(src)}>
            <CustomGrid
                className={clsx([styles.backgroundVideo, videoClassName])}
            >
                <ConditionalRender
                    condition={templateType === 'video' && !isMobile()}
                >
                    <CustomVideoPlayer
                        isPlaying={!isScreenSharing}
                        isMuted={!isAudioBackgroundActive}
                        volume={backgroundAudioVolume}
                        src={src}
                        className={styles.player}
                    />
                </ConditionalRender>
                <ConditionalRender
                    condition={templateType === 'link' && !isMobile()}
                >
                    <CustomYoutubePlayer url={src} className={styles.player} />
                </ConditionalRender>

                {children}
            </CustomGrid>
        </ConditionalRender>
    );
};

export const MeetingBackgroundVideo = memo(Component);
