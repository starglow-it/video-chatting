import React, { memo } from 'react';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { SplitViewProps } from './types';

import styles from './SplitView.module.scss';

const SplitView = memo(({ children }: SplitViewProps) => (
    <CustomGrid container className={styles.splitViewWrapper}>
        {React.Children.map(children, child => (
            <CustomGrid
                className={styles.splitView}
                flexShrink={1}
                flexGrow={1}
                flexBasis="50%"
            >
                {child}
            </CustomGrid>
        ))}
    </CustomGrid>
));

export { SplitView };
