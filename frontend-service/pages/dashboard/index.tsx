import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { TemplatesContainer } from '@containers/TemplatesContainer/TemplatesContainer';

import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const TemplatesPage: NextPage = (): JSX.Element => (
    <DashboardLayout>
        <TemplatesContainer />
    </DashboardLayout>
);

TemplatesPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'templates', 'dashboard', 'notifications', 'profile', 'forms'],
});

export default enhance(TemplatesPage);
