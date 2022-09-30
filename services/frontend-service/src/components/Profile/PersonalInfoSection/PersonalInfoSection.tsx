import React, { memo } from 'react';

import { SplitView } from '@components/SplitView/SplitView';
import { PersonalInfo } from '@components/Profile/PersonalInfo/PersonalInfo';
import { MonetizationInfo } from '@components/Profile/MonetizationInfo/MonetizationInfo';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

import styles from './PersonalInfoSection.module.scss';

const PersonalInfoSection = memo(() => (
    <CustomPaper className={styles.personalInfoWrapper}>
        <SplitView>
            <PersonalInfo />
            <MonetizationInfo />
        </SplitView>
    </CustomPaper>
));

export { PersonalInfoSection };
