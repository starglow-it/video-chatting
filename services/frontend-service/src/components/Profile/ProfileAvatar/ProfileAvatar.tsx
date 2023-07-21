import { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// helpers
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { Translation } from '@library/common/Translation/Translation';
import { emptyFunction } from '../../../utils/functions/emptyFunction';

// styles
import styles from './ProfileAvatar.module.scss';

// types
import { ProfileAvatarProps } from './types';

const Component = (
    {
        onClick = emptyFunction,
        src,
        className,
        width,
        height,
        userName,
        withoutShadow,
        isAcceptNoLogin,
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
            className={clsx(className, styles.wrapper, {
                [styles.shadow]: !withoutShadow,
                [styles.orange]: isAcceptNoLogin,
            })}
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
                <svg
                    className={styles.text}
                    width="100%"
                    height="100%"
                    viewBox="0 0 38 38"
                >
                    <ConditionalRender condition={!isAcceptNoLogin}>
                        <text
                            dominantBaseline="middle"
                            fill="currentColor"
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            style={{
                                fontWeight: 600,
                            }}
                        >
                            {splitName}
                        </text>
                    </ConditionalRender>

                    <ConditionalRender condition={isAcceptNoLogin}>
                        <text
                            dominantBaseline="middle"
                            textAnchor="middle"
                            x="50%"
                            y="43%"
                            className={styles.yourText}
                            fill="currentColor"
                        >
                            <Translation
                                nameSpace="profile"
                                translation="personalInfo.your"
                            />
                        </text>
                        <text
                            dominantBaseline="middle"
                            textAnchor="middle"
                            x="50%"
                            y="63%"
                            className={styles.yourText}
                            fill="currentColor"
                        >
                            <Translation
                                nameSpace="profile"
                                translation="personalInfo.logo"
                            />
                        </text>
                    </ConditionalRender>
                </svg>
            )}
        </CustomGrid>
    );
};

export const ProfileAvatar = memo<ProfileAvatarProps>(
    forwardRef<HTMLDivElement, ProfileAvatarProps>(Component),
);
