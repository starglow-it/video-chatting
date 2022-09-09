import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { Support } from '@components/Support/Support';

import { pageLoaded } from '../src/store';

const SupportPage: NextPage = (): JSX.Element => <Support />;

const enhance = withStart(pageLoaded);

SupportPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'static'],
});

export default enhance(SupportPage);
