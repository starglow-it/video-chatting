import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library';

// styles
import styles from './SetUpTemplateInfo.module.scss';

const SetUpCompanyName = memo(() => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const currentCompanyNameErrorMessage: string = errors?.companyName?.[0]?.message || '';

    return (
        <CustomGrid container direction="column" gap={1.75}>
            <CustomBox>
                <CustomTypography className={styles.companyNameTitle} variant="body1bold">
                    1.
                </CustomTypography>
                &nbsp;
                <CustomTypography
                    className={styles.companyNameTitle}
                    variant="body1bold"
                    nameSpace="forms"
                    translation="labels.companyName"
                />
            </CustomBox>
            <CustomInput error={currentCompanyNameErrorMessage} {...register('companyName')} />
        </CustomGrid>
    );
});

export { SetUpCompanyName };
