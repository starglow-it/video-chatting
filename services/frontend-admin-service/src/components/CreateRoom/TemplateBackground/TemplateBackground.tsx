import { memo } from 'react';

// shared
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import { TemplateBackgroundProps } from './TemplateBackground.types';

import styles from './TemplateBackground.module.scss';

const Component = ({
    url,
    templateType,
    youtubeUrl,
}: TemplateBackgroundProps) => (
    <CustomGrid container className={styles.background}>
        <ConditionalRender condition={!!url || !!youtubeUrl}>
            {templateType === 'image' && !youtubeUrl && (
                <CustomImage
                    src={url ?? ''}
                    alt="background_preview"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            )}
            {templateType === 'video' && !youtubeUrl && (
                <CustomVideoPlayer
                    src={url}
                    className={styles.player}
                    volume={100}
                    isPlaying
                    isMuted={false}
                />
            )}
           
        </ConditionalRender>
    </CustomGrid>
);

export const TemplateBackground = memo(Component);
