import type {
	NextPage 
} from 'next';
import {
	withStart 
} from 'effector-next';

import {
	ResetPasswordContainer 
} from '@containers/ResetPasswordContainer/ResetPasswordContainer';

import {
	pageLoaded 
} from '../src/store';

const ResetPasswordPage: NextPage = (): JSX.Element => (
	<ResetPasswordContainer />
);

const enhance = withStart(pageLoaded);

ResetPasswordPage.getInitialProps = () => ({
	namespacesRequired: ['common'],
});

export default enhance(ResetPasswordPage);
