import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import React from 'react';

import { WelcomePageContainer } from '@containers/WelcomePageContainer/WelcomePageContainer';

import { pageLoaded } from '../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const WelcomePage: NextPage = (): JSX.Element => <WelcomePageContainer />;

WelcomePage.getInitialProps = () => ({
    namespacesRequired: ['common', 'welcome', 'templates'],
});

export default enhance(WelcomePage);
