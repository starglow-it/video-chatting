import type { NextPage } from 'next';
import React from 'react';
import { withStart } from 'effector-next';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const StatisticsPage: NextPage = (): JSX.Element => <StatisticsContainer />;

StatisticsPage.getInitialProps = async () => ({
    namespacesRequired: ['common'],
});

export default enhance(StatisticsPage);
