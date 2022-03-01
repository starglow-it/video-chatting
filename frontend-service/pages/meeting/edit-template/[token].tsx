import React from 'react';
import { withStart } from 'effector-next';

import { EditTemplateContainer } from '@containers/EditTemplateContainer/EditTemplateContainer';
import { Layout } from '@components/Layout/Layout';

import { pageLoaded } from '../../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

const EditTemplatePage = (): JSX.Element => (
    <Layout>
        <EditTemplateContainer />
    </Layout>
);

EditTemplatePage.getInitialProps = async (): Promise<any> => ({
    namespacesRequired: ['common', 'meeting', 'errors', 'forms'],
});

export default enhance(EditTemplatePage);
