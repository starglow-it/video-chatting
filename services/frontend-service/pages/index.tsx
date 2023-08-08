import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { MainContainer } from '@containers/MainContainer/MainContainer';
import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const Home: NextPage = (): JSX.Element => <MainContainer />;

Home.getInitialProps = async () => ({
    namespacesRequired: ['common', 'register', 'notifications'],
});

export default enhance(Home);
