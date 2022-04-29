import React, { useMemo, memo, useCallback, useState } from 'react';
import { Fade } from '@mui/material';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { SetUpCompanyName } from './SetUpCompanyName';
import { SetUpFullName } from './SetUpFullName';
import { SetUpProfileAvatar } from './SetUpProfileAvatar';
import { SetUpProfileSign } from './SetUpProfileSign';
import { SetUpTemplateProgress } from './SetUpTemplateProgress';

// styles
import styles from './SetUpTemplateInfo.module.scss';

enum TemplateSetUpSteps {
    companyName = 'companyName',
    fullName = 'fullName',
    profileAvatar = 'profileAvatar',
    profileSign = 'profileSign',
}

const STEPS = {
    [TemplateSetUpSteps.companyName]: SetUpCompanyName,
    [TemplateSetUpSteps.fullName]: SetUpFullName,
    [TemplateSetUpSteps.profileAvatar]: SetUpProfileAvatar,
    [TemplateSetUpSteps.profileSign]: SetUpProfileSign,
};

const SetUpTemplateInfo = memo(() => {
    const { trigger } = useFormContext();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = useCallback(async () => {
        const stepKey = Object.keys(STEPS)[currentStep];
        const isValid = await trigger(stepKey);

        if (isValid || stepKey === TemplateSetUpSteps.profileAvatar) {
            setCurrentStep(prev => (prev + 1 < Object.keys(STEPS).length ? prev + 1 : prev));
        }
    }, [currentStep]);

    const renderStepsComponents = useMemo(
        () =>
            Object.entries(STEPS).map((entry, i) => {
                const Component = entry[1];

                return (
                    <Fade key={entry[0]} in={currentStep === i}>
                        <CustomGrid container className={styles.stepWrapper}>
                            <Component />
                        </CustomGrid>
                    </Fade>
                );
            }),
        [currentStep],
    );

    const isTheLastStep = currentStep === Object.keys(STEPS).length - 1;

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomBox
                className={styles.grid}
                display="grid"
                gap={5}
                gridTemplateColumns="1fr"
                gridTemplateRows="min-content 1fr min-content"
            >
                <CustomTypography
                    gridArea="1/1/1/1"
                    className={styles.title}
                    variant="h2bold"
                    nameSpace="templates"
                    translation="setUpSpace.title"
                />
                <CustomBox position="relative" gridArea="2/1/2/1" className={styles.steps}>
                    <SetUpTemplateProgress
                        currentStep={currentStep}
                        steps={Object.keys(STEPS).length}
                    />
                    {renderStepsComponents}
                </CustomBox>
                <CustomButton
                    className={clsx(styles.button, { [styles.hide]: isTheLastStep })}
                    onClick={handleNextStep}
                    nameSpace="templates"
                    translation="buttons.continue"
                />
                <CustomButton
                    type="submit"
                    className={clsx(styles.button, { [styles.hide]: !isTheLastStep })}
                    nameSpace="templates"
                    translation="buttons.done"
                />
            </CustomBox>
        </CustomPaper>
    );
});

export { SetUpTemplateInfo };
