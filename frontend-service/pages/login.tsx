import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { SignInContainer } from '@containers/SignInContainer/SignInContainer';
import { Layout } from '@components/Layout/Layout';
import { pageLoaded } from '../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const LogInPage: NextPage = (): JSX.Element => (
    <Layout>
        <SignInContainer />
    </Layout>
);

LogInPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms'],
});

export default enhance(LogInPage);
