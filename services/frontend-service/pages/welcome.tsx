import { WelcomePageContainer } from '@containers/WelcomePageContainer/WelcomePageContainer';
import { withStart } from 'effector-next';
import { NextPage } from 'next';
import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const WelcomePage: NextPage = (): JSX.Element => <WelcomePageContainer />;

WelcomePage.getInitialProps = () => ({
    namespacesRequired: ['common', 'welcome', 'templates'],
});

export default enhance(WelcomePage);
