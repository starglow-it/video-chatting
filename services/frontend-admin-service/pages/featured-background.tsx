import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { pageLoaded } from '../src/store';
import { FeaturedBackgroundContainer } from '@containers/FeaturedBackgroundContainer/FeaturedBackgroundContainer';

const enhance = withStart(pageLoaded);

const FeaturedBackgroundPage: NextPage = (): JSX.Element => (
    <FeaturedBackgroundContainer />
);

FeaturedBackgroundPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'rooms'],
});

export default enhance(FeaturedBackgroundPage);
