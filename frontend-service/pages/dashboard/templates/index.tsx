import type { NextPage } from 'next';
import { withStart } from 'effector-next';

import { TemplatesContainer } from '@containers/TemplatesContainer/TemplatesContainer';

import { Layout } from '@components/Layout/Layout';
import { DashboardLayout } from '@components/DashboardLayout/DashboardLayout';

import { pageLoaded } from '../../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const TemplatesPage: NextPage = (): JSX.Element => (
    <Layout>
        <DashboardLayout>
            <TemplatesContainer />
        </DashboardLayout>
    </Layout>
);

TemplatesPage.getInitialProps = () => ({
    namespacesRequired: ['common', 'templates'],
});

export default enhance(TemplatesPage);
