import React, {forwardRef, memo} from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import styles from './ProfileAvatar.module.scss';

import { ProfileAvatarProps } from './types';

const ProfileAvatar = memo(forwardRef(({ onClick, src, className, width, height, userName, withoutShadow, ...rest }: ProfileAvatarProps, ref) => {
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
                {...rest}
            >
                {src ? (
                    <Image
                        loading="lazy"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className={styles.profileImage}
                        src={src || '/images/defaultProfileImage.png'}
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
    }),
);

export { ProfileAvatar };
