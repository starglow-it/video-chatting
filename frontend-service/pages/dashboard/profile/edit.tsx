import { withStart } from 'effector-next';

import { EditProfileContainer } from '@containers/EditProfileContainer/EditProfileContainer';

import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../../src/store';

// @ts-ignore
const enhance = withStart(pageLoaded);

const EditProfilePage = (): JSX.Element => (
    <DashboardLayout>
        <EditProfileContainer />
    </DashboardLayout>
);

EditProfilePage.getInitialProps = () => ({
    namespacesRequired: ['common', 'profile', 'templates', 'forms', 'errors', 'dashboard'],
});

export default enhance(EditProfilePage);
