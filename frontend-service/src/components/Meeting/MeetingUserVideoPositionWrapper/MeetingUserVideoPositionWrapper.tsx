import React, { memo, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const MeetingUserVideoPositionWrapper = memo(
    ({ children, elevationIndex, isScreensharing }: MeetingUserVideoPositionWrapperProps) => {
        const [top, setTop] = useState('50%');
        const [left, setLeft] = useState('50%');

        useLayoutEffect(() => {
            if (isScreensharing) {
                setLeft('calc(100% - 28px)');
                setTop(`calc(50% + ${70 * elevationIndex}px)`);
            } else {
                const randomTop = Math.random() * 80;
                const randomLeft = Math.random() * 80;

                setTop(`${randomTop}%`);
                setLeft(`${randomLeft}%`);
            }
        }, [isScreensharing, elevationIndex]);

        return (
            <CustomBox
                sx={{ zIndex: elevationIndex, top, left }}
                className={clsx(styles.videoWrapper, { [styles.sharing]: isScreensharing })}
            >
                {children}
            </CustomBox>
        );
    },
);

export { MeetingUserVideoPositionWrapper };
