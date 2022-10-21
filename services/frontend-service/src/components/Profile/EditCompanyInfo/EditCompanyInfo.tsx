import React, { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// library
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { MoneyIcon } from '@library/icons/MoneyIcon';

// components
import { BusinessCategoriesSelect } from '@components/BusinessCategoriesSelect/BusinessCategoriesSelect';

// store
import { getBusinessCategoriesFx } from '../../../store';

// styles
import styles from './EditCompanyInfo.module.scss';

const EditCompanyInfo = memo(() => {
    const {
        formState: { errors },
        register,
    } = useFormContext();

    const currentEmailErrorMessage: string = errors?.contactEmail?.[0]?.message || '';
    const currentCompanyNameErrorMessage: string = errors?.companyName?.[0]?.message || '';
    const currentDescriptionErrorMessage: string = errors?.description?.[0]?.message || '';

    useEffect(() => {
        getBusinessCategoriesFx({});
    }, []);

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomBox
                display="grid"
                gridTemplateColumns="minmax(110px, 192px) 1fr"
                gridTemplateRows="repeat(1, 1fr)"
            >
                <CustomBox gridArea="1/1/1/1">
                    <CustomGrid container alignItems="center">
                        <MoneyIcon width="24px" height="24px" className={styles.icon} />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="company"
                        />
                    </CustomGrid>
                </CustomBox>
                <CustomGrid
                    gridArea="1/2/1/2"
                    container
                    wrap="nowrap"
                    className={styles.contentWrapper}
                >
                    <CustomGrid container direction="column">
                        <CustomTypography
                            variant="body1"
                            nameSpace="profile"
                            translation="editProfile.company.title"
                            className={styles.title}
                        />
                        <CustomGrid container direction="column" justifyContent="center" gap={4}>
                            <CustomInput
                                nameSpace="forms"
                                translation="companyName"
                                error={currentCompanyNameErrorMessage}
                                {...register('companyName')}
                            />

                            <EmailInput
                                nameSpace="forms"
                                translation="contactEmail"
                                error={currentEmailErrorMessage}
                                {...register('contactEmail')}
                            />

                            <BusinessCategoriesSelect
                                nameSpace="profile"
                                translation="editProfile.businessCategories"
                                formKey="businessCategories"
                            />

                            <CustomInput
                                nameSpace="forms"
                                translation="businessDescription"
                                multiline
                                maxRows={4}
                                error={currentDescriptionErrorMessage}
                                {...register('description')}
                            />
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
            </CustomBox>
        </CustomPaper>
    );
});

export { EditCompanyInfo };
