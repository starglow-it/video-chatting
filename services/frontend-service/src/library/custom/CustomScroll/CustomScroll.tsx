import { memo } from 'react';

import PerfectScrollbar, { ScrollBarProps } from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const CustomScroll = memo(
    ({ className, children, ...rest }: ScrollBarProps) => (
        <PerfectScrollbar className={className} {...rest}>
            {children}
        </PerfectScrollbar>
    ),
);

export { CustomScroll };
