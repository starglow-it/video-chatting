import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './TagItem.module.scss';

// types
import { PropsWithClassName } from '../../../types';

type TagItemProps = PropsWithClassName<{
    children: React.ReactNode;
}>;

const Component: React.FunctionComponent<TagItemProps> = ({ className, children }) => (
    <CustomGrid item alignItems="center" className={clsx(styles.wrapper, className)}>
        {children}
    </CustomGrid>
);

export const TagItem = memo(Component);
