import React, { memo } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const CustomScroll = memo(({ className, children, ...rest }) => {
    return (
        <PerfectScrollbar className={className} {...rest}>
            {children}
        </PerfectScrollbar>
    );
});

export { CustomScroll };
