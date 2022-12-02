import type {
	NextPage 
} from 'next';
import {
	withStart 
} from 'effector-next';

import {
	EditRoomContainer 
} from '@containers/EditRoomContainer/EditRoomContainer';

import {
	pageLoaded 
} from '../../../src/store';

const EditRoomPage: NextPage = (): JSX.Element => <EditRoomContainer />;

const enhance = withStart(pageLoaded);

EditRoomPage.getInitialProps = () => ({
	namespacesRequired: ['common', 'static', 'createRoom', 'subscriptions'],
});

export default enhance(EditRoomPage);
