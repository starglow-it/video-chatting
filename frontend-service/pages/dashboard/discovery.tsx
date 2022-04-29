import { withStart } from 'effector-next';

import { DiscoveryContainer } from '@containers/DiscoveryContainer/DiscoveryContainer';
import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const DiscoveryPage = (): JSX.Element => (
        <DashboardLayout>
            <DiscoveryContainer />
        </DashboardLayout>
    )

DiscoveryPage.getInitialProps = () => ({
    namespacesRequired: [
        'common',
        'profile',
        'templates',
        'dashboard',
        'notifications',
        'forms',
        'errors',
    ],
});

export default enhance(DiscoveryPage);
