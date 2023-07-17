import { withStart } from 'effector-next';
import dynamic from 'next/dynamic';

import { pageLoaded } from '../../src/store';

const MeetingContainer = dynamic(
    () => import('@containers/MeetingContainer/MeetingContainer'),
    {
        ssr: false,
    },
);

const enhance = withStart(pageLoaded);

const MeetingPage = (): JSX.Element => <MeetingContainer />;

MeetingPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'meeting', 'errors', 'forms'],
});

export default enhance(MeetingPage);
