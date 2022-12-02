import type {
    NextPage
} from 'next';
import React from 'react';
import {
    withStart
} from 'effector-next';
import {
    CreateAdminRoomContainer
} from '@containers/CreateAdminRoomContainer/CreateAdminRoomContainer';

import {
    pageLoaded
} from '../../../src/store';

const enhance = withStart(pageLoaded);

const CreateAdminRoomPage: NextPage = (): JSX.Element => <CreateAdminRoomContainer />;

CreateAdminRoomPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'statistics', 'rooms', 'errors'],
});

export default enhance(CreateAdminRoomPage);
