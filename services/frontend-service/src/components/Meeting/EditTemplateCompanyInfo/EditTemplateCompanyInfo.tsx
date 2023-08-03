import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { BusinessCategoriesSelect } from '@components/BusinessCategoriesSelect/BusinessCategoriesSelect';

const EditTemplateCompanyInfo = memo(() => {
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

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            gap={4}
        >
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
            <BusinessCategoriesSelect
                nameSpace="meeting"
                translation="templates.businessCategories"
                formKey="businessCategories"
            />
        </CustomGrid>
    );
});

export { EditTemplateCompanyInfo };
