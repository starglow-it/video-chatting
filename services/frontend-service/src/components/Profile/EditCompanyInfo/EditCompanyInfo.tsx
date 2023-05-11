import React, { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MoneyIcon } from 'shared-frontend/icons/OtherIcons/MoneyIcon';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// library
import { EmailInput } from '@library/common/EmailInput/EmailInput';

// store
import { getBusinessCategoriesFx } from '../../../store';

// styles
import styles from './EditCompanyInfo.module.scss';
import { CustomAccordion } from '@library/custom/CustomAccordion/CustomAccordion';

const EditCompanyInfo = memo(() => {
    const {
        formState: { errors },
        register,
    } = useFormContext();

    const currentEmailErrorMessage: string =
        errors?.contactEmail?.[0]?.message || '';
    const currentCompanyNameErrorMessage: string =
        errors?.companyName?.[0]?.message || '';
    const currentDescriptionErrorMessage: string =
        errors?.description?.[0]?.message || '';
    const currentFullNameErrorMessage: string =
        errors?.fullName?.[0]?.message || '';

    useEffect(() => {
        getBusinessCategoriesFx({});
    }, []);

    return (
        <CustomAccordion
            sumary={
                <>
                    <MoneyIcon
                        width="24px"
                        height="24px"
                        className={styles.icon}
                    />
                    <CustomTypography
                        variant="body1"
                        fontWeight="600"
                        nameSpace="profile"
                        translation="company"
                        width="240px"
                    />
                    <CustomGrid
                        container
                        display="flex"
                        justifyContent="flex-start"
                    >
                        <CustomTypography
                            variant="body1"
                            nameSpace="profile"
                            translation="editProfile.personal.title"
                        />
                    </CustomGrid>
                </>
            }
            sumaryProps={{
                classes: {
                    content: styles.sumary,
                },
            }}
            detail={
                <CustomGrid
                    container
                    wrap="nowrap"
                    className={styles.contentWrapper}
                >
                    <CustomGrid
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <CustomGrid
                            container
                            direction="column"
                            justifyContent="center"
                            gap={4}
                            width="400px"
                        >
                            <CustomInput
                                nameSpace="forms"
                                translation="fullName"
                                error={currentFullNameErrorMessage}
                                {...register('fullName')}
                            />
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
            }
        />
    );
});

export { EditCompanyInfo };
