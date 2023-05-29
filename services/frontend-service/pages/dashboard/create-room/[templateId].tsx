import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { pageLoaded } from 'src/store';
import { CreateRoomContainer } from '@containers/CreateRoomContainer/CreateRoomContainer';

const CreateRoomPage: NextPage = (): JSX.Element => <CreateRoomContainer />;

const enhance = withStart(pageLoaded);

CreateRoomPage.getInitialProps = () => ({
    namespacesRequired: [
        'common',
        'static',
        'createRoom',
        'subscriptions',
        'notifications',
    ],
});

export default enhance(CreateRoomPage);
