import type { NextPage } from 'next';

import { ResetPasswordContainer } from '@containers/ResetPasswordContainer/ResetPasswordContainer';

const ResetPasswordPage: NextPage = (): JSX.Element => <ResetPasswordContainer />;

ResetPasswordPage.getInitialProps = () => ({
    namespacesRequired: ['common'],
});

export default ResetPasswordPage;
