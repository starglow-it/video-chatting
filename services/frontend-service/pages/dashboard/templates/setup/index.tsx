import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { SetUpTemplateContainer } from '@containers/SetUpTemplateContainer/SetUpTemplateContainer';

import { pageLoaded } from '../../../../src/store';

const enhance = withStart(pageLoaded);

const SetupTemplatePage: NextPage = (): JSX.Element => (
    <SetUpTemplateContainer />
);

SetupTemplatePage.getInitialProps = () => ({
    namespacesRequired: [
        'common',
        'templates',
        'forms',
        'dashboard',
        'subscriptions',
    ],
});

export default enhance(SetupTemplatePage);
