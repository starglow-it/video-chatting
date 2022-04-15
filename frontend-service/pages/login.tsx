import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { SignInContainer } from '@containers/SignInContainer/SignInContainer';
import { pageLoaded } from '../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const LogInPage: NextPage = (): JSX.Element => <SignInContainer />;

LogInPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms', 'notifications', 'errors'],
});

export default enhance(LogInPage);
