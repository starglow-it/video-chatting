import React, { memo, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// types
import { MeetingUserVideoPositionWrapperProps } from './types';

// styles
import styles from './MeetingUserVideoPositionWrapper.module.scss';

const Component: React.FunctionComponent<MeetingUserVideoPositionWrapperProps> = ({
    elevationIndex,
    usersNumber = 0,
    children,
    isScreensharing,
    bottom,
    left,
}: MeetingUserVideoPositionWrapperProps) => {
    const [finalBottom, setBottom] = useState('50%');
    const [finalLeft, setLeft] = useState('50%');

    useLayoutEffect(() => {
        if (isScreensharing) {
            setLeft('calc(100% - 28px)');
            setBottom(`calc(50% - ${70 * elevationIndex}px + ${(70 / 2) * usersNumber}px)`);
        } else {
            setLeft(`${left * 100}%`);
            setBottom(`${bottom * 100}%`);
        }
    }, [isScreensharing, elevationIndex, bottom, left, usersNumber]);

    if (bottom && left) {
        return (
            <CustomBox
                sx={{ bottom: finalBottom, left: finalLeft }}
                className={clsx(styles.videoWrapper, { [styles.sharing]: isScreensharing })}
            >
                {children}
            </CustomBox>
        );
    }

    return null;
};

export const MeetingUserVideoPositionWrapper = memo(Component);
