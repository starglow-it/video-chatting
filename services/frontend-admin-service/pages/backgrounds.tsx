import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { pageLoaded } from '../src/store';
import { BackgroundsContainer } from '@containers/BackgroundsContainer/BackgroundsContainer';

const enhance = withStart(pageLoaded);

const BackgroundsPage: NextPage = (): JSX.Element => <BackgroundsContainer />;

BackgroundsPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'rooms'],
});

export default enhance(BackgroundsPage);
