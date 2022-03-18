import { withStart } from 'effector-next';

import { DiscoveryContainer } from '@containers/DiscoveryContainer/DiscoveryContainer';

import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';
import { Layout } from '@components/Layout/Layout';

import { pageLoaded } from '../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const DiscoveryPage = (): JSX.Element => (
    <Layout>
        <DashboardLayout>
            <DiscoveryContainer />
        </DashboardLayout>
    </Layout>
);

DiscoveryPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'profile', 'templates'],
});

export default enhance(DiscoveryPage);
