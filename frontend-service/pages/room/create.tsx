import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { CreateRoomContainer } from '@containers/CreateRoomContainer/CreateRoomContainer';

import { pageLoaded } from '../../src/store';

const CreateRoomPage: NextPage = (): JSX.Element => <CreateRoomContainer />;

const enhance = withStart(pageLoaded);

CreateRoomPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'static'],
});

export default enhance(CreateRoomPage);
