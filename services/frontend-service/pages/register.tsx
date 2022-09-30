import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { RegisterContainer } from '@containers/RegisterContainer/RegisterContainer';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const RegisterPage: NextPage = (): JSX.Element => <RegisterContainer />;

RegisterPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms', 'errors'],
});

export default enhance(RegisterPage);
