import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { RegisterContainer } from '@containers/RegisterContainer/RegisterContainer';

import { SuccessfulRegisterDialog } from '@components/Dialogs/SuccessfulRegisterDialog/SuccessfulRegisterDialog';
import { Layout } from '@components/Layout/Layout';

import { pageLoaded } from '../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const RegisterPage: NextPage = (): JSX.Element => (
    <Layout>
        <SuccessfulRegisterDialog />
        <RegisterContainer />
    </Layout>
);

RegisterPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms', 'errors'],
});

export default enhance(RegisterPage);
