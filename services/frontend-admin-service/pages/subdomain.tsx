import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { pageLoaded } from '../src/store';
import { RoomsWithSubdomainContainer } from '@containers/RoomsWithSubdomainContainer/RoomsWithSubdomainContainer';

const enhance = withStart(pageLoaded);

const RoomsWithSubdomainPage: NextPage = (): JSX.Element => (
    <RoomsWithSubdomainContainer />
);

RoomsWithSubdomainPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'statistics', 'rooms', 'errors'],
});

export default enhance(RoomsWithSubdomainPage);
