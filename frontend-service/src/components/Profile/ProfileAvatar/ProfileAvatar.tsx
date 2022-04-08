import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

// helpers
import {emptyFunction} from "../../../utils/functions/emptyFunction";

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './ProfileAvatar.module.scss';

// types
import { ProfileAvatarProps } from './types';

const InitialComponent = (
    {
        onClick = emptyFunction,
        src,
        className,
        width,
        height,
        userName,
        withoutShadow,
        ...rest
    }: ProfileAvatarProps,
    ref,
) => {
    const splitName = userName
        ?.split(' ')
        .map(word => word[0]?.toUpperCase())
        .join(' ');

    return (
        <CustomGrid
            ref={ref}
            container
            justifyContent="center"
            alignItems="center"
            className={clsx(className, styles.wrapper, { [styles.shadow]: !withoutShadow })}
            sx={{ width, height }}
            onClick={onClick}
        >
            {src ? (
                <Image
                    loading="lazy"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    src={src}
                    alt="profile-image"
                />
            ) : (
                <svg className={styles.text} width="100%" height="100%" viewBox="0 0 38 38">
                    <text
                        dominantBaseline="middle"
                        fill="currentColor"
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        style={{ fontWeight: 600 }}
                    >
                        {splitName}
                    </text>
                </svg>
            )}
        </CustomGrid>
    );
}

const ProfileAvatar = memo<ProfileAvatarProps>(forwardRef<HTMLDivElement, ProfileAvatarProps>(InitialComponent));

export { ProfileAvatar };
