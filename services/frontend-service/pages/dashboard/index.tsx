import type {
	NextPage 
} from 'next';
import {
	withStart 
} from 'effector-next';

import {
	TemplatesContainer 
} from '@containers/TemplatesContainer/TemplatesContainer';

import {
	DashboardLayout 
} from '@components/DashboardLayout/DashboardLayout';

import {
	pageLoaded 
} from '../../src/store';

const enhance = withStart(pageLoaded);

const TemplatesPage: NextPage = (): JSX.Element => (
	<DashboardLayout>
		<TemplatesContainer />
	</DashboardLayout>
);

TemplatesPage.getInitialProps = () => ({
	namespacesRequired: [
		'common',
		'templates',
		'dashboard',
		'notifications',
		'subscriptions',
		'profile',
		'forms',
		'errors',
		'dates',
	],
});

export default enhance(TemplatesPage);
