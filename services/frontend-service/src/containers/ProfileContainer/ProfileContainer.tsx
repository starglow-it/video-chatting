import { memo } from 'react';

import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';
import { PersonalInfoSection } from '@components/Profile/PersonalInfoSection/PersonalInfoSection';
import { MainInfo } from '@components/Profile/MainInfo/MainInfo';
import { RecordingList } from '@components/Profile/RecordingList/RecordingList';
import { SubscriptionInfo } from '@components/Profile/SubscriptionInfo/SubscriptionInfo';

import styles from './ProfileContainer.module.scss';

const ProfileContainer = memo(() => {
    return (
        <MainProfileWrapper className={styles.wrapper}>
            <MainInfo />
            <PersonalInfoSection />
            <RecordingList />
            <SubscriptionInfo />
        </MainProfileWrapper>
    )
});

export { ProfileContainer };
