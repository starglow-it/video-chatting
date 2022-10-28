import type { NextPage } from 'next';
import React from 'react';
import { withStart } from 'effector-next';
import { UsersStatisticsContainer } from '@containers/UsersStatisticsContainer/UsersStatisticsContainer';

import { pageLoaded } from '../../src/store';

const enhance = withStart(pageLoaded);

const UsersPage: NextPage = (): JSX.Element => <UsersStatisticsContainer />;

UsersPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'statistics'],
});

export default enhance(UsersPage);
