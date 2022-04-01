import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { ProfileContainer } from '@containers/ProfileContainer/ProfileContainer';

import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const DashboardPage: NextPage = (): JSX.Element => (
    <DashboardLayout>
        <ProfileContainer />
    </DashboardLayout>
);

DashboardPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'profile', 'dashboard'],
});

export default enhance(DashboardPage);
