import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { pageLoaded } from '../src/store';
import dynamic from 'next/dynamic';

const enhance = withStart(pageLoaded);

const RegisterEndCallContainer = dynamic(
    () =>
        import('@containers/RegisterEndCallContainer/RegisterEndCallContainer'),
    {
        ssr: false,
    },
);

const RegisterPage: NextPage = (): JSX.Element => <RegisterEndCallContainer />;

RegisterPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms', 'errors'],
});

export default enhance(RegisterPage);
