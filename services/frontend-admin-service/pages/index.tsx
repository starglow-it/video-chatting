import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { AdminLoginContainer } from '@containers/AdminLoginContainer/AdminLoginContainer';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const AdminLogin: NextPage = (): JSX.Element => <AdminLoginContainer />;

AdminLogin.getInitialProps = async () => ({
	namespacesRequired: ['common', 'forms', 'errors'],
});

export default enhance(AdminLogin);
