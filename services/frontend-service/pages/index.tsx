import type {
	NextPage 
} from 'next';
import React from 'react';
import {
	withStart 
} from 'effector-next';

import {
	pageLoaded 
} from '../src/store';

const enhance = withStart(pageLoaded);

const Home: NextPage = (): JSX.Element => <div />;

Home.getInitialProps = async () => ({
	namespacesRequired: ['common', 'register', 'notifications'],
});

export default enhance(Home);
