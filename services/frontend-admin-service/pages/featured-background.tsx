import type { NextPage } from 'next';
import { withStart } from 'effector-next';
import { FeaturedBackgroundContainer } from '@containers/FeaturedBackgroundContainer/FeaturedBackgroundContainer';
import { pageLoaded } from '../src/store';

const enhance = withStart(pageLoaded);

const FeaturedBackgroundPage: NextPage = (): JSX.Element => (
    <FeaturedBackgroundContainer />
);

FeaturedBackgroundPage.getInitialProps = async () => ({
    namespacesRequired: ['common', 'rooms'],
});

export default enhance(FeaturedBackgroundPage);
