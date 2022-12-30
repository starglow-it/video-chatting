import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '../../custom/CustomGrid';

// styles
import { PropsWithClassName } from '../../../types';
import styles from './TagItem.module.scss';

// types

type TagItemProps = PropsWithClassName<{
    label: JSX.Element | string;
    endIcon?: JSX.Element;
    startIcon?: JSX.Element;
    color?: string;
}>;

const Component: React.FunctionComponent<TagItemProps> = ({ startIcon, endIcon, className, color, label }) => (
    <CustomGrid item alignItems="center" sx={{ color }} className={clsx(styles.wrapper, className)}>
        {startIcon ? startIcon : null}
        {label}
        {endIcon ? endIcon : null}
    </CustomGrid>
);

const TagItem = memo(Component);

export default TagItem;
