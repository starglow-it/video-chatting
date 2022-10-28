import { memo } from 'react';
import { CenteredPaper } from 'shared-frontend/library';

const Component = () => {
    return <CenteredPaper>Statistics</CenteredPaper>;
};

export const StatisticsContainer = memo(Component);
