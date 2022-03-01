import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { ProfileContainer } from '@containers/ProfileContainer/ProfileContainer';

import { Layout } from '@components/Layout/Layout';
import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const DashboardPage: NextPage = (): JSX.Element => (
    <Layout>
        <DashboardLayout>
            <ProfileContainer />
        </DashboardLayout>
    </Layout>
);

DashboardPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'profile'],
});

export default enhance(DashboardPage);
