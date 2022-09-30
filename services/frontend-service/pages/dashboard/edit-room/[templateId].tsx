import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { CreateRoomContainer } from '@containers/CreateRoomContainer/CreateRoomContainer';

import { pageLoaded } from '../../../src/store';

const EditRoomPage: NextPage = (): JSX.Element => <CreateRoomContainer isEditing />;

const enhance = withStart(pageLoaded);

EditRoomPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'static', 'createRoom'],
});

export default enhance(EditRoomPage);
