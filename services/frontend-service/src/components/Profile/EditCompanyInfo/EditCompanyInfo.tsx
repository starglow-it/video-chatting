import { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInputBase/CustomInput';
import { EmailInput } from '@library/common/EmailInputBase/EmailInput';

// store
import { CustomAccordion } from '@library/custom/CustomAccordion/CustomAccordion';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { $profileStore, getBusinessCategoriesFx } from '../../../store';

// styles
import styles from './EditCompanyInfo.module.scss';

const EditCompanyInfo = memo(() => {
    const profile = useStore($profileStore);

    const {
        formState: { errors },
        register,
    } = useFormContext();

    const currentEmailErrorMessage: string =
        errors?.contactEmail?.message?.toString() || '';
    const currentCompanyNameErrorMessage: string =
        errors?.companyName?.message?.toString() || '';
    const currentDescriptionErrorMessage: string =
        errors?.description?.message?.toString() || '';
    const currentFullNameErrorMessage: string =
        errors?.fullName?.message?.toString() || '';

    useEffect(() => {
        getBusinessCategoriesFx({});
    }, []);

    return (
        <CustomAccordion
            sumary={
                <>
                    <PersonIcon
                        width="24px"
                        height="24px"
                        className={styles.icon}
                    />
                    <CustomTypography
                        variant="body1"
                        fontWeight="600"
                        nameSpace="profile"
                        translation="personal"
                        width="253px"
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
                            item
                            container
                            direction="column"
                            justifyContent="center"
                            gap={4}
                            width="400px"
                        >
                            <CustomInput
                                nameSpace="forms"
                                translation="fullName"
                                fullWidth
                                error={currentFullNameErrorMessage}
                                {...register('fullName')}
                            />
                            <CustomInput
                                nameSpace="forms"
                                translation="nameOfYourLive"
                                error={currentCompanyNameErrorMessage}
                                {...register('companyName')}
                            />

                            <EmailInput
                                placeholder={profile.email}
                                disabled
                                error={currentEmailErrorMessage}
                                {...register('contactEmail')}
                            />

                            <CustomInput
                                nameSpace="forms"
                                translation="teamOrganization"
                                placeholder={profile.teamOrganization}
                                disabled
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
