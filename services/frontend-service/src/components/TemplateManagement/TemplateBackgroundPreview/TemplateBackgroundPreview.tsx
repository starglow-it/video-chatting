import React, { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// types
import { TemplateBackgroundPreviewProps } from './TemplateBackgroundPreview.types';

// utils
import { isVideoFile } from '../../../utils/files/isVideoFile';

// styles
import styles from './TemplateBackgroundPreview.module.scss';

const Component = ({ children, isFileUploading }: TemplateBackgroundPreviewProps) => {
    const { control } = useFormContext();

    const url = useWatch({ control, name: 'url' });

    return (
        <CustomGrid className={styles.background}>
            <ConditionalRender condition={Boolean(url) && isVideoFile(url)}>
                <CustomVideoPlayer
                    src={url}
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
                    <CustomLoader />
                </CustomPaper>
            </ConditionalRender>
            {children}
        </CustomGrid>
    );
};

export const TemplateBackgroundPreview = memo(Component);
