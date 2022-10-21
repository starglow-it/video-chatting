import { memo } from "react";
import {
    CenteredPaper,
} from 'shared-frontend/library';

const Component = () => {
    return (
        <CenteredPaper>Statistics</CenteredPaper>
    );
}

const StatisticsContainer = memo(Component);

export default StatisticsContainer;