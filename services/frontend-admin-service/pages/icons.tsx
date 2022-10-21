import type { NextPage } from 'next';
import React from 'react';
import { withStart } from 'effector-next';

import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const AdminLogin: NextPage = (): JSX.Element => (
    <div>
        <span>RoundArrowIcon</span>
    </div>
);

// AdminLogin.getInitialProps = async () => ({
//     namespacesRequired: ['common', 'register', 'notifications'],
// });

export default enhance(AdminLogin);
