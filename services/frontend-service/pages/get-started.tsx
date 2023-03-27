import React from 'react';
import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { StartRoomWithoutTokenContainer } from '@containers/StartRoomWithoutToken/StartRoomWithoutToken';
import { pageLoaded } from '../src/store';
import { AppContext } from 'next/app';

const enhance = withStart(pageLoaded);

const WelcomePage: NextPage = (): JSX.Element => (
    <StartRoomWithoutTokenContainer />
);

WelcomePage.getInitialProps = () => ({
    namespacesRequired: ['common', 'welcome', 'templates'],
});

export default enhance(WelcomePage);
