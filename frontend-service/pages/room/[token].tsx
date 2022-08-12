import React from 'react';
import { withStart } from 'effector-next';
import dynamic from 'next/dynamic';

import { pageLoaded } from '../../src/store';
import { MediaContextProvider } from '../../src/contexts/MediaContext';

const MeetingContainer = dynamic(() => import('@containers/MeetingContainer/MeetingContainer'), {
    ssr: false,
});

// @ts-ignore
const enhance = withStart(pageLoaded);

const MeetingPage = (): JSX.Element => (
    <MediaContextProvider>
        <MeetingContainer />
    </MediaContextProvider>
);

MeetingPage.getInitialProps = async (): Promise<any> => ({
    namespacesRequired: ['common', 'meeting', 'errors', 'forms'],
});

export default enhance(MeetingPage);
