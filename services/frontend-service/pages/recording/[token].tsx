import { withStart } from 'effector-next';
import dynamic from 'next/dynamic';

import { pageLoaded } from '../../src/store';

const RecordingVideoContainer = dynamic(
    () => import('@containers/RecordingVideoContainer/RecordingVideoContainer'),
    {
        ssr: false,
    },
);

const enhance = withStart(pageLoaded);

const RecordingVideoPage = (): JSX.Element => <RecordingVideoContainer />;

RecordingVideoPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'recording', 'errors', 'forms'],
});

export default enhance(RecordingVideoPage);
