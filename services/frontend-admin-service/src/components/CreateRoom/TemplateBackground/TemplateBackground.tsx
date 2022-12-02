import React, {memo} from "react";

import {TemplateBackgroundProps} from "./TemplateBackground.types";
import {
    CustomGrid,
    CustomImage,
    ConditionalRender,
    CustomVideoPlayer,
} from "shared-frontend";

import styles from './TemplateBackground.module.scss';

const Component = ({ url }: TemplateBackgroundProps) => {
    return (
        <CustomGrid className={styles.background}>
            <ConditionalRender condition={Boolean(url)}>
                {!/\.mp4$/.test(url)
                    ? (
                        <CustomImage
                            src={url ?? ''}
                            alt="background_preview"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    )
                    : (
                        <CustomVideoPlayer
                            src={url}
                            className={styles.player}
                            volume={100}
                            isPlaying
                            isMuted={false}
                        />
                    )
                }
            </ConditionalRender>
        </CustomGrid>
    )
}

export const TemplateBackground = memo(Component);