import { memo } from 'react';
import { Skeleton } from '@mui/material';

const SkeletonTemplate = memo(() => (
    <Skeleton variant="rectangular" width={334} height={190} />
));

export { SkeletonTemplate };
