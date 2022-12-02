import type {
	NextPage 
} from 'next';
import {
	withStart 
} from 'effector-next';

import {
	Agreements 
} from '@components/Agreements/Agreements';

import {
	pageLoaded 
} from '../src/store';

const AgreementsPage: NextPage = (): JSX.Element => <Agreements />;

const enhance = withStart(pageLoaded);

AgreementsPage.getInitialProps = () => ({
	namespacesRequired: ['common', 'static'],
});

export default enhance(AgreementsPage);
