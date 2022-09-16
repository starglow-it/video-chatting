import React, { memo, useEffect, useMemo } from 'react';
import { VideoJsPlayerOptions } from 'video.js';
import { useFormContext, useWatch } from 'react-hook-form';
import Image from 'next/image';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomVideoPlayer } from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';

// styles
import styles from './TemplateBackgroundPreview.module.scss';

const Component = ({ children }) => {
    const { control } = useFormContext<IUploadTemplateFormData>();

    const background = useWatch<IUploadTemplateFormData>({ control, name: 'background' });

    const fileUrl = useMemo(
        () => background?.file && URL.createObjectURL(background?.file),
        [background?.file],
    );

    useEffect(() => () => fileUrl && URL.revokeObjectURL(fileUrl), [fileUrl]);

    const videoJsOptions = useMemo(
        (): VideoJsPlayerOptions => ({
            autoplay: true,
            controls: false,
            responsive: true,
            fill: true,
            loop: true,
            muted: true,
            width: '100%',
            height: '100%',
            sources: [
                {
                    src: fileUrl,
                    type: background?.file.type,
                },
            ],
        }),
        [background?.file, fileUrl],
    );

    return (
        <CustomGrid className={styles.background}>
            <ConditionalRender condition={/^video/g.test(background?.file.type)}>
                <CustomVideoPlayer
                    options={videoJsOptions}
                    type={background?.file.type}
                    className={styles.player}
                />
            </ConditionalRender>
            <ConditionalRender condition={/^image/g.test(background?.file.type)}>
                <Image
                    src={background?.dataUrl}
                    alt="background_preview"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </ConditionalRender>
            {children}
        </CustomGrid>
    );
};

export const TemplateBackgroundPreview = memo(Component);
