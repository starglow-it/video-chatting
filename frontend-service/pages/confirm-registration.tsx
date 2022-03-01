import type { NextPage } from 'next';

import { ConfirmRegistration } from '@components/ConfirmRegistration/ConfirmRegistration';
import { Layout } from '@components/Layout/Layout';

const ConfirmPage: NextPage = (): JSX.Element => (
    <Layout>
        <ConfirmRegistration />
    </Layout>
);

ConfirmPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register'],
});

export default ConfirmPage;
