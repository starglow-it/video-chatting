import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { BusinessContainer } from '@containers/BusinessContainer/BusinessContainer';
import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const BusinessPage: NextPage = (): JSX.Element => <BusinessContainer />;

BusinessPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'rooms'],
});

export default enhance(BusinessPage);
