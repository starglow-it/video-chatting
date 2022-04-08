import React from 'react';
import { withStart } from 'effector-next';

import { EditTemplateContainer } from '@containers/EditTemplateContainer/EditTemplateContainer';

import { pageLoaded } from '../../../src/store/root';

// @ts-ignore
const enhance = withStart(pageLoaded);

function EditTemplatePage(): JSX.Element {
    return <EditTemplateContainer />;
}

EditTemplatePage.getInitialProps = async (): Promise<any> => ({
    namespacesRequired: ['common', 'meeting', 'errors', 'forms'],
});

export default enhance(EditTemplatePage);
