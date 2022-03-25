import type { NextPage } from 'next';

import { ConfirmRegistration } from '@components/ConfirmRegistration/ConfirmRegistration';

const ConfirmPage: NextPage = (): JSX.Element => (
    <ConfirmRegistration />
);

ConfirmPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register'],
});

export default ConfirmPage;
