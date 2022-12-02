import type {
	NextPage 
} from 'next';
import {
	withStart 
} from 'effector-next';

import {
	ConfirmRegistration 
} from '@components/ConfirmRegistration/ConfirmRegistration';

import {
	pageLoaded 
} from '../src/store';

const ConfirmPage: NextPage = (): JSX.Element => <ConfirmRegistration />;

const enhance = withStart(pageLoaded);

ConfirmPage.getInitialProps = () => ({
	namespacesRequired: ['common', 'register'],
});

export default enhance(ConfirmPage);
