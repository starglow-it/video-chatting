import { withStart } from 'effector-next';

import { EditProfileContainer } from '@containers/EditProfileContainer/EditProfileContainer';

import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';
import { Layout } from '@components/Layout/Layout';

import { pageLoaded } from '../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const EditProfilePage = (): JSX.Element => (
    <Layout>
        <DashboardLayout>
            <EditProfileContainer />
        </DashboardLayout>
    </Layout>
);

EditProfilePage.getInitialProps = () => ({
    namespacesRequired: ['common', 'profile', 'templates', 'forms', 'errors'],
});

export default enhance(EditProfilePage);
