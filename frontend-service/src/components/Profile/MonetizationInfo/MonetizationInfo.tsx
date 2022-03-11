import React, { memo } from 'react';
import Image from 'next/image';

// helpers
import {useToggle} from "../../../hooks/useToggle";

import { MonetizationIcon } from '@library/icons/MonetizationIcon';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './MonetizationInfo.module.scss';

const MonetizationInfo = memo(() => {
    const {
        value: isMonetizationEnabled,
        onToggleSwitch: handleToggleMonetization
    } = useToggle(false);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.monetizationWrapper}
        >
            <CustomGrid container alignItems="center">
                <MonetizationIcon className={styles.monetizationIcon} width="24px" height="24px" />
                <CustomTypography
                    fontWeight={600}
                    nameSpace="profile"
                    translation="monetization.title"
                />
                <CustomSwitch
                    checked={isMonetizationEnabled}
                    onChange={handleToggleMonetization}
                    className={styles.monetizationSwitch}
                />
            </CustomGrid>
            <CustomGrid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={styles.descriptionWrapper}
            >
                <Image src="/images/money-image.png" width="40px" height="40px" />
                <CustomTypography
                    className={styles.text}
                    textAlign="center"
                    nameSpace="profile"
                    translation="monetization.description"
                />
            </CustomGrid>
        </CustomGrid>
    )
});

export { MonetizationInfo };
