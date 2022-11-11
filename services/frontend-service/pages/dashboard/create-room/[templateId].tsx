import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import dynamic from "next/dynamic";

const CreateRoomContainer = dynamic(() => import('@containers/CreateRoomContainer/CreateRoomContainer'), {
    ssr: false,
});

import { pageLoaded } from 'src/store';

const CreateRoomPage: NextPage = (): JSX.Element => <CreateRoomContainer />;

const enhance = withStart(pageLoaded);

CreateRoomPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'static', 'createRoom', 'subscriptions'],
});

export default enhance(CreateRoomPage);
