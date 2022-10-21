import React, { memo, useMemo } from 'react';
import { VideoJsPlayerOptions } from 'video.js';
import Image from 'next/image';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomVideoPlayer } from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// store
import { uploadTemplateFileFx, uploadUserTemplateFileFx } from '../../../store';

// utils
import { isVideoFile } from '../../../utils/files/isVideoFile';

// styles
import styles from './TemplateBackgroundPreview.module.scss';

const Component = ({ children }: React.PropsWithChildren<unknown>) => {
    const isTemplatePreviewPending = useStore(uploadTemplateFileFx.pending);
    const isUpdateMeetingTemplateFilePending = useStore(uploadUserTemplateFileFx.pending);

    const { control } = useFormContext();

    const url = useWatch({ control, name: 'url' });

    const videoJsOptions = useMemo(
        (): VideoJsPlayerOptions => ({
            autoplay: true,
            controls: false,
            responsive: true,
            fill: true,
            loop: true,
            sources: [
                {
                    src: url ?? '',
                    type: 'video/mp4',
                },
            ],
        }),
        [url],
    );

    return (
        <CustomGrid className={styles.background}>
            <ConditionalRender condition={Boolean(url) && isVideoFile(url)}>
                <CustomVideoPlayer options={videoJsOptions} className={styles.player} />
            </ConditionalRender>
            <ConditionalRender condition={Boolean(url) && !isVideoFile(url)}>
                <Image
                    src={url ?? ''}
                    alt="background_preview"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </ConditionalRender>
            <ConditionalRender
                condition={isTemplatePreviewPending || isUpdateMeetingTemplateFilePending}
            >
                <CustomPaper variant="black-glass" className={styles.loader}>
                    <WiggleLoader />
                </CustomPaper>
            </ConditionalRender>
            {children}
        </CustomGrid>
    );
};

export const TemplateBackgroundPreview = memo(Component);
