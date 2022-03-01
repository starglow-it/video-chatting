import type { NextPage } from 'next';
import React from 'react';
import { withStart } from 'effector-next';

import { Layout } from '@components/Layout/Layout';

import { pageLoaded } from '../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const Home: NextPage = (): JSX.Element => (
    <Layout>
        <div />
    </Layout>
);

Home.getInitialProps = async () => ({
    namespacesRequired: ['common', 'register'],
});

export default enhance(Home);
