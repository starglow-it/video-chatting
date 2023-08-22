import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { LanguagesSelect } from '@components/LanguagesSelect/LanguagesSelect';

const Component = () => {
    const {
        formState: { errors },
        register,
    } = useFormContext();

    console.log('#Duy Phan console', errors);

    const currentFullNameErrorMessage: string =
        errors?.fullName?.[0]?.message?.toString() || '';
    const currentPositionErrorMessage: string =
        errors?.position?.[0]?.message?.toString() || '';

    return (
        <CustomGrid container wrap="nowrap" direction="column" gap={4}>
            <CustomInput
                nameSpace="forms"
                translation="fullName"
                error={currentFullNameErrorMessage}
                {...register('fullName')}
            />
            <CustomInput
                nameSpace="forms"
                translation="position"
                error={currentPositionErrorMessage}
                {...register('position')}
            />
            <LanguagesSelect
                nameSpace="meeting"
                translation="templates.languages"
            />
        </CustomGrid>
    );
};

export const EditTemplatePersonalInfo = memo(Component);
