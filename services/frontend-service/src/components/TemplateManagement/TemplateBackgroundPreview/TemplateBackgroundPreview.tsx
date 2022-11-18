import React, { memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomVideoPlayer } from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// utils

// shared
import { CustomImage } from 'shared-frontend/library';

// types
import { TemplateBackgroundPreviewProps } from '@components/TemplateManagement/TemplateBackgroundPreview/TemplateBackgroundPreview.types';
import { CustomVideoPlayerOptions } from '@library/custom/CustomVideoPlayer/types';
import { isVideoFile } from '../../../utils/files/isVideoFile';

// styles
import styles from './TemplateBackgroundPreview.module.scss';

const Component = ({ children, isFileUploading }: TemplateBackgroundPreviewProps) => {
    const { control } = useFormContext();

    const url = useWatch({ control, name: 'url' });

    const videoJsOptions = useMemo(
        (): CustomVideoPlayerOptions => ({
            src: url ?? '',
            type: 'video/mp4',
        }),
        [url],
    );

    return (
        <CustomGrid className={styles.background}>
            <ConditionalRender condition={Boolean(url) && isVideoFile(url)}>
                <CustomVideoPlayer
                    options={videoJsOptions}
                    className={styles.player}
                    volume={0}
                    isPlaying
                    isMuted={false}
                />
            </ConditionalRender>
            <ConditionalRender condition={Boolean(url) && !isVideoFile(url)}>
                <CustomImage
                    src={url ?? ''}
                    alt="background_preview"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </ConditionalRender>
            <ConditionalRender condition={isFileUploading}>
                <CustomPaper variant="black-glass" className={styles.loader}>
                    <WiggleLoader />
                </CustomPaper>
            </ConditionalRender>
            {children}
        </CustomGrid>
    );
};

export const TemplateBackgroundPreview = memo(Component);
