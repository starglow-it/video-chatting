import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { pageLoaded } from '../../../src/store';
import {EditAdminRoomContainer} from "@containers/EditAdminRoomContainer/EditAdminRoomContainer";

const enhance = withStart(pageLoaded);

const EditAdminRoomPage: NextPage = (): JSX.Element => (
    <EditAdminRoomContainer />
);

EditAdminRoomPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'statistics', 'rooms', 'errors'],
});

export default enhance(EditAdminRoomPage);
