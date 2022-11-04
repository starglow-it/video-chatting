import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './TagItem.module.scss';

// types
import { PropsWithClassName } from 'shared-frontend/types';

type TagItemProps = PropsWithClassName<{
    children: React.ReactNode;
    color?: string;
}>;

const Component: React.FunctionComponent<TagItemProps> = ({ className, color, children }) => (
    <CustomGrid item alignItems="center" sx={{ color }} className={clsx(styles.wrapper, className)}>
        {children}
    </CustomGrid>
);

export const TagItem = memo(Component);
