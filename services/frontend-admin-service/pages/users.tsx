import type { NextPage } from 'next';
import React from 'react';
import { withStart } from 'effector-next';
import { UsersContainer } from '@containers/UsersContainer/UsersContainer';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const UsersPage: NextPage = (): JSX.Element => <UsersContainer />;

UsersPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'statistics', 'users', 'errors'],
});

export default enhance(UsersPage);
