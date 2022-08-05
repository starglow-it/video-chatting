import React, { memo } from 'react';

import { MainProfileWrapper } from '@library/common/MainProfileWrapper/MainProfileWrapper';
import { PersonalInfoSection } from '@components/Profile/PersonalInfoSection/PersonalInfoSection';
import { MainInfo } from '@components/Profile/MainInfo/MainInfo';

import styles from './ProfileContainer.module.scss';
import {SubscriptionInfo} from "@components/Profile/SubscriptionInfo/SubscriptionInfo";

const ProfileContainer = memo(() => {
    return (
        <MainProfileWrapper className={styles.wrapper}>
            <MainInfo />
            <PersonalInfoSection />
            <SubscriptionInfo />
        </MainProfileWrapper>
    );
});

export { ProfileContainer };
