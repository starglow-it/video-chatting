import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// styles
import styles from '@components/Templates/SetUpTemplateInfo/SetUpTemplateInfo.module.scss';

const SetUpFullName = memo(() => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const currentFullNameErrorMessage: string =
        errors?.fullName?.[0]?.message || '';

    return (
        <CustomGrid container direction="column" gap={1.75}>
            <CustomBox>
                <CustomTypography
                    className={styles.companyNameTitle}
                    variant="body1bold"
                >
                    2.
                </CustomTypography>
                &nbsp;
                <CustomTypography
                    className={styles.companyNameTitle}
                    variant="body1bold"
                    nameSpace="forms"
                    translation="labels.fullName"
                />
            </CustomBox>
            <CustomInput
                error={currentFullNameErrorMessage}
                {...register('fullName')}
            />
        </CustomGrid>
    );
});

export { SetUpFullName };
