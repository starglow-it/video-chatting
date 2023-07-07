import React, { memo, useMemo } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// styles
import { PropsWithClassName } from 'shared-frontend/types';
import styles from './UsersAvatarsCounter.module.scss';

// types

const Component = <ItemType,>({
    className,
    users = [],
    onAction,
    withCounter = false,
    renderItem,
}: PropsWithClassName<{
    users: ItemType[];
    withCounter?: boolean;
    onAction?: () => void;
    renderItem: (item: ItemType, index: number) => JSX.Element;
}>) => {
    const renderCurrentUsers = useMemo(() => users.map(renderItem), [users]);

    const finalUsers = withCounter
        ? renderCurrentUsers.slice(0, 2)
        : renderCurrentUsers;

    const counter = withCounter ? renderCurrentUsers.slice(2).length : 0;

    return (
        <CustomGrid
            container
            alignItems="center"
            className={className}
            onClick={onAction}
        >
            <CustomGrid container wrap="nowrap" className={styles.users}>
                {finalUsers}
            </CustomGrid>
            <ConditionalRender condition={withCounter && counter !== 0}>
                &nbsp;
                <CustomTypography color="colors.white.primary">
                    + {counter}
                </CustomTypography>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const UsersAvatarsCounter = memo(Component) as typeof Component;
