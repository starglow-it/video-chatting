import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { SeatRegisterContainer } from '@containers/RegisterContainer/SeatRegisterContainer';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const RegisterPage: NextPage = (): JSX.Element => <SeatRegisterContainer />;

RegisterPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'register', 'forms', 'errors'],
});

export default enhance(RegisterPage);
