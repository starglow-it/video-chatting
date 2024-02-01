import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { Analytics } from '@components/Analytics/Analytics';

import { pageLoaded } from '../src/store';

const AnalyticsPage: NextPage = (): JSX.Element => <Analytics />;

const enhance = withStart(pageLoaded);

AnalyticsPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'static'],
});

export default enhance(AnalyticsPage);
