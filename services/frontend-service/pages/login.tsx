import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { withStart } from 'effector-next';
import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);
const SignInContainer = dynamic(
    () => import('@containers/SignInContainer/SignInContainer'),
    {
        ssr: false,
    },
);

const LogInPage: NextPage = (): JSX.Element => <SignInContainer />;

LogInPage.getInitialProps = () => ({
    namespacesRequired: [
        'common',
        'register',
        'forms',
        'notifications',
        'errors',
    ],
});

export default enhance(LogInPage);
