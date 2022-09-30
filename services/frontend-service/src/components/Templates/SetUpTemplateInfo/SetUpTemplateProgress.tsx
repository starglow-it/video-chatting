import React, { memo } from 'react';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// styles
import styles from './SetUpTemplateInfo.module.scss';

const SetUpTemplateProgress = memo(
    ({ currentStep, steps }: { currentStep: number; steps: number }) => {
        const progressStyle = {
            '--width': `${Math.floor((100 / steps) * (currentStep + 1))}%`,
        } as React.CSSProperties;

        return (
            <CustomBox position="relative" className={styles.progress}>
                <CustomBox className={styles.passedSteps} style={progressStyle} />
            </CustomBox>
        );
    },
);

export { SetUpTemplateProgress };
