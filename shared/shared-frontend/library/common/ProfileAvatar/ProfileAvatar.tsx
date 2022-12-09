import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

// helpers
import { CustomGrid } from '../../custom/CustomGrid';
import { CustomImage } from '../../custom/CustomImage';

// styles
import styles from './ProfileAvatar.module.scss';

// types
import { ProfileAvatarProps } from './types';

const Component = (
    {
        onClick,
        src,
        className,
        width,
        height,
        userName,
        withoutShadow,
        ...rest
    }: ProfileAvatarProps,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const splitName = userName
        ?.split(' ')
        .map(word => word[0]?.toUpperCase())
        .slice(0, 2)
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
            {...rest}
        >
            {src ? (
                <CustomImage
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
};

const ProfileAvatar = memo<ProfileAvatarProps>(
    forwardRef<HTMLDivElement, ProfileAvatarProps>(Component),
);

export default ProfileAvatar;
