import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { RoomsContainer } from '@containers/RoomsContainer/RoomsContainer';

import { pageLoaded } from '../../src/store';

const enhance = withStart(pageLoaded);

const RoomsPage: NextPage = (): JSX.Element => <RoomsContainer />;

RoomsPage.getInitialProps = async () => ({
	namespacesRequired: ['common', 'statistics', 'rooms', 'errors'],
});

export default enhance(RoomsPage);
